import {
  Injectable,
  NotAcceptableException,
  UnauthorizedException,
  BadRequestException,
  ServiceUnavailableException,
  RequestTimeoutException,
  ForbiddenException,
  NotFoundException,
} from "@nestjs/common"
import { LoginBody } from "./auth.interface"
import { UpdatePwdDto, ResetPwdDto } from "./auth.dto"
import { Request, Response } from "express"
import { User } from "src/models/user.model"
import * as bcrypt from "bcrypt"
import * as crypto from "crypto"
import { JwtService } from "@nestjs/jwt"
import { MailService } from "src/mail/mail.service"
import { addMinutes, compareAsc } from "date-fns"

@Injectable()
export class AuthService {
  constructor(
    private readonly mailService: MailService,
    private readonly jwtService: JwtService,
  ) {}

  async login(req: Request, res: Response, body: LoginBody) {
    const cookies = req.cookies
    const { email, password, verificationCode } = body
    if (!email || !password) {
      throw new NotAcceptableException("Email and password are required!")
    }

    const foundUser = await User.findOne({ email }).exec()
    if (!foundUser) {
      throw new UnauthorizedException()
    }

    const match = await bcrypt.compare(password, foundUser.password)
    if (!match) {
      throw new UnauthorizedException()
    }

    if (!foundUser.emailConfirmed) {
      this.mailService.sendEmailConfirmation(
        email,
        foundUser.emailConfirmationCode,
      )
      throw new BadRequestException(
        "You must confirm your email address to log in!",
      )
    }

    if (!verificationCode) {
      const code = crypto.randomBytes(6).toString("hex")
      const date = addMinutes(new Date(), 5)

      try {
        foundUser.verificationCode = code
        foundUser.verificationCodeExpiredAt = date
        await foundUser.save()

        this.mailService.sendVerificationCode(email, code)
        res.status(206).send("We send verification code on your email")
      } catch (err) {
        throw new ServiceUnavailableException()
      }
    }

    if (compareAsc(new Date(), foundUser.verificationCodeExpiredAt) !== -1) {
      throw new RequestTimeoutException("Verification code expired")
    }

    if (verificationCode !== foundUser.verificationCode) {
      throw new UnauthorizedException("Verification code not valid")
    }

    if (foundUser.refreshToken.length > 5) {
      foundUser.refreshToken = []
      await foundUser.save()
    }

    const refreshTokenArr = !cookies?.jwt
      ? foundUser.refreshToken
      : foundUser.refreshToken.filter((rt) => rt !== cookies.jwt)

    const accessToken = await this.jwtService.signAsync(
      { id: foundUser._id },
      { expiresIn: "15m", secret: process.env.ACCESS_TOKEN },
    )
    const newRefreshToken = await this.jwtService.signAsync(
      { id: foundUser._id },
      { expiresIn: "7d", secret: process.env.REFRESH_TOKEN },
    )

    foundUser.refreshToken = [...refreshTokenArr, newRefreshToken]
    foundUser.verificationCode = null
    foundUser.verificationCodeExpiredAt = null
    await foundUser.save()

    res.cookie("jwt", newRefreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })

    return res.json({ accessToken })
  }

  async logout(req: Request, res: Response) {
    const cookies = req.cookies
    if (!cookies?.jwt) return res.sendStatus(204)
    const refreshToken = cookies.jwt
    res.clearCookie("jwt", { httpOnly: true, secure: true, sameSite: "none" })

    try {
      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: process.env.REFRESH_TOKEN,
      })

      const foundUser = await User.findById(payload.id).exec()
      if (!foundUser) return res.sendStatus(204)

      foundUser.refreshToken = foundUser.refreshToken.filter(
        (rt) => rt !== refreshToken,
      )
      await foundUser.save()
    } finally {
      return res.sendStatus(204)
    }
  }

  async refresh(req: Request, res: Response) {
    const cookies = req.cookies
    if (!cookies?.jwt) return res.sendStatus(204)
    const refreshToken = cookies.jwt
    res.clearCookie("jwt", { httpOnly: true, secure: true, sameSite: "none" })

    const payload = await this.jwtService
      .verifyAsync(refreshToken, {
        secret: process.env.REFRESH_TOKEN,
      })
      .catch(() => {
        throw new ForbiddenException()
      })

    const foundUser = await User.findById(payload.id).exec()
    if (!foundUser) throw new ForbiddenException()

    const refreshTokenArr = foundUser.refreshToken.filter(
      (rt) => rt !== refreshToken,
    )
    const accessToken = await this.jwtService.signAsync(
      { id: foundUser._id },
      { expiresIn: "15m", secret: process.env.ACCESS_TOKEN },
    )
    const newRefreshToken = await this.jwtService.signAsync(
      { id: foundUser._id },
      { expiresIn: "7d", secret: process.env.REFRESH_TOKEN },
    )

    foundUser.refreshToken = [...refreshTokenArr, newRefreshToken]
    await foundUser.save()

    res.cookie("jwt", newRefreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })

    return res.json({ accessToken })
  }

  async changePassword(req: Request, res: Response, body: UpdatePwdDto) {
    const { password, newPassword, verificationCode } = body

    if (password === newPassword) {
      throw new NotAcceptableException(
        "Old password cannot be equal to the new password",
      )
    }

    const user = await User.findById(req.userId).exec()
    if (!user) {
      throw new UnauthorizedException()
    }

    const match = await bcrypt.compare(password, user.password)
    if (!match) {
      throw new UnauthorizedException()
    }

    if (!verificationCode) {
      const code = crypto.randomBytes(6).toString("hex")
      const date = addMinutes(new Date(), 5)

      try {
        user.verificationCode = code
        user.verificationCodeExpiredAt = date
        await user.save()

        this.mailService.sendPasswordChangeCode(user.email, code)
        res.status(206).send("We send verification code on your email")
      } catch (err) {
        throw new ServiceUnavailableException()
      }
    }

    if (compareAsc(new Date(), user.verificationCodeExpiredAt) !== -1) {
      throw new RequestTimeoutException("Verification code expired")
    }

    if (verificationCode !== user.verificationCode) {
      throw new UnauthorizedException("Verification code not valid")
    }

    const hashedPwd = await bcrypt.hash(newPassword, 10)
    user.password = hashedPwd
    user.verificationCode = null
    user.verificationCodeExpiredAt = null
    await user.save()

    return res.sendStatus(200)
  }

  async resetPassword(res: Response, body: ResetPwdDto) {
    const user = await User.findOne({ email: body.email }).exec()
    if (!user) {
      throw new NotFoundException()
    }

    if (!user.resetPasswordPermission) {
      try {
        const permissionCode = `${user._id}${crypto.randomBytes(20).toString("hex")}`
        user.resetPasswordPermissionCode = permissionCode
        await user.save()

        this.mailService.sendResetPasswordConfirmation(
          body.email,
          permissionCode,
        )

        return res
          .status(206)
          .send(`We send confirmation letter on your email.`)
      } catch (err) {
        throw new ServiceUnavailableException()
      }
    }

    if (!body.newPassword) {
      throw new BadRequestException("You must enter a new password")
    }

    if (bcrypt.compareSync(body.newPassword, user.password)) {
      throw new NotAcceptableException(
        "Old password cannot be equal to the new password",
      )
    }

    const hashedPwd = await bcrypt.hash(body.newPassword, 10)

    user.password = hashedPwd
    user.resetPasswordPermission = false
    await user.save()

    return res.status(200).send("Password resetted")
  }

  async confirmPasswordReset(code: string) {
    if (!code) throw new BadRequestException()
    const userId = code.slice(0, 24)
    const foundUser = await User.findById(userId).exec()

    if (!foundUser) throw new NotFoundException()
    if (foundUser.resetPasswordPermissionCode !== code) {
      throw new NotFoundException()
    }

    foundUser.resetPasswordPermission = true
    foundUser.resetPasswordPermissionCode = null

    await foundUser.save()

    return "Success, password reset confirmed!"
  }
}
