import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  ServiceUnavailableException,
  UnauthorizedException,
} from "@nestjs/common"
import { PrismaService } from "src/prisma/prisma.service"
import { MailService } from "src/mail/mail.service"
import { LoginDto } from "./auth.dto"
import { Request, Response } from "express"
import * as bcrypt from "bcrypt"
import { isAfter, addMinutes } from "date-fns"
import { generateRandomNumber } from "src/utils/number.generator"
import { JwtService } from "@nestjs/jwt"

interface JwtPayload {
  userId: string
}

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mailService: MailService,
    private readonly jwt: JwtService,
  ) {}

  async login(req: Request, res: Response, body: LoginDto) {
    const cookies = req.cookies as Record<string, string | undefined>
    const { username, password, verificationCode } = body

    const user = await this.prisma.user.findUnique({ where: { username } })
    if (!user) {
      throw new UnauthorizedException("Invalid credentials")
    }

    if (!user.email_verified) {
      if (
        user.email_confirmation_code_sent_at &&
        isAfter(
          new Date(),
          addMinutes(user.email_confirmation_code_sent_at, 10),
        )
      ) {
        await this.mailService.sendEmailConfirmation(
          user.email,
          user.email_confirmation_code!,
        )
      }
      throw new BadRequestException(
        "Email not confirmed. Please check your email.",
      )
    }

    const pwdMatch = await bcrypt.compare(password, user.password)
    if (!pwdMatch) {
      throw new UnauthorizedException("Invalid credentials")
    }

    if (!verificationCode) {
      const code = generateRandomNumber(8)
      const expires_at = addMinutes(new Date(), 5)
      try {
        await this.prisma.verificationCode.update({
          where: { user_id: user.id },
          data: { code, expires_at },
        })
        await this.mailService.sendVerificationCode(user.email, code)

        return res
          .status(202)
          .json({ message: "Verification code sent to email" })
      } catch {
        throw new ServiceUnavailableException()
      }
    }

    const foundUserVerificationCode =
      await this.prisma.verificationCode.findUnique({
        where: { user_id: user.id },
      })

    if (!foundUserVerificationCode) {
      throw new UnauthorizedException()
    }
    if (verificationCode !== foundUserVerificationCode.code) {
      throw new UnauthorizedException("Invalid credentials")
    }
    if (
      foundUserVerificationCode.expires_at &&
      isAfter(new Date(), foundUserVerificationCode.expires_at)
    ) {
      throw new UnauthorizedException("Verification code expired")
    }

    await this.prisma.verificationCode.update({
      where: { user_id: user.id },
      data: { code: null, expires_at: null },
    })

    if (cookies.jwt) {
      const payload: JwtPayload = this.jwt.decode(cookies.jwt)
      if (payload?.userId) {
        await this.prisma.refreshToken
          .deleteMany({
            where: {
              user_id: payload.userId,
              token: cookies.jwt,
            },
          })
          .catch(() => console.error("Failed to delete existing refresh token"))
      }
    }

    const accessToken = this.jwt.sign(
      { userId: user.id },
      { expiresIn: "15m", secret: process.env.ACCESS_TOKEN },
    )
    const refreshToken = this.jwt.sign(
      { userId: user.id },
      { expiresIn: "7d", secret: process.env.REFRESH_TOKEN },
    )

    await this.prisma.refreshToken.create({
      data: {
        user_id: user.id,
        token: refreshToken,
        expires_at: addMinutes(new Date(), 60 * 24 * 7),
      },
    })

    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      secure: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: "strict",
    })

    return res.json({ accessToken })
  }

  async refresh(req: Request, res: Response) {
    const token = (req.cookies as Record<string, string | undefined>)?.jwt
    if (!token) {
      throw new ForbiddenException()
    }

    let payload: JwtPayload
    try {
      payload = await this.jwt.verifyAsync<JwtPayload>(token, {
        secret: process.env.REFRESH_TOKEN,
      })
    } catch {
      res.clearCookie("jwt", {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
      })
      throw new ForbiddenException()
    }

    const deletedToken = await this.prisma.refreshToken.deleteMany({
      where: {
        user_id: payload.userId,
        token,
      },
    })

    if (deletedToken.count === 0) {
      await this.prisma.refreshToken.deleteMany({
        where: { user_id: payload.userId },
      })
      res.clearCookie("jwt", {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
      })
      throw new ForbiddenException("Security alert: Token reuse detected")
    }

    const foundUser = await this.prisma.user.findUnique({
      where: { id: payload.userId },
    })
    if (!foundUser) throw new ForbiddenException()

    const accessToken = this.jwt.sign(
      { userId: foundUser.id },
      { expiresIn: "15m", secret: process.env.ACCESS_TOKEN },
    )

    const refreshToken = this.jwt.sign(
      { userId: foundUser.id },
      { expiresIn: "7d", secret: process.env.REFRESH_TOKEN },
    )

    await this.prisma.refreshToken.create({
      data: {
        user_id: foundUser.id,
        token: refreshToken,
        expires_at: addMinutes(new Date(), 60 * 24 * 7),
      },
    })

    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      secure: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: "strict",
    })

    return res.json({ accessToken })
  }

  async logout(req: Request, res: Response) {
    const cookies = req.cookies as Record<string, string | undefined>
    const token = cookies?.jwt
    if (!token) {
      return res.sendStatus(204)
    }

    res.clearCookie("jwt", { httpOnly: true, secure: true, sameSite: "strict" })

    try {
      const payload: JwtPayload = this.jwt.decode(token)
      if (payload?.userId) {
        await this.prisma.refreshToken.deleteMany({
          where: {
            user_id: payload.userId,
            token,
          },
        })
      }
    } catch (error) {
      console.error("Logout error:", error)
    }

    return res.sendStatus(204)
  }
}
