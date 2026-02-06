import {
  ConflictException,
  Injectable,
  NotFoundException,
  ServiceUnavailableException,
} from "@nestjs/common"
import { CreateUserDto } from "./register.dto"
import { PrismaService } from "src/prisma/prisma.service"
import { MailService } from "src/mail/mail.service"
import * as bcrypt from "bcrypt"
import * as crypto from "crypto"

@Injectable()
export class RegisterService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mailService: MailService,
  ) {}

  async createUser(body: CreateUserDto) {
    const { username, email, password } = body
    const [duplicateUser, duplicateEmail] = await Promise.all([
      this.prisma.user.findUnique({ where: { username } }),
      this.prisma.user.findUnique({ where: { email } }),
    ])

    if (duplicateUser) {
      throw new ConflictException("Username already exists")
    }
    if (duplicateEmail) {
      throw new ConflictException("Email already exists")
    }

    const hashedPwd = await bcrypt.hash(password, 10)
    const email_confirmation_code = crypto.randomBytes(32).toString("hex")
    try {
      await this.prisma.user.create({
        data: {
          username,
          email,
          password: hashedPwd,
          email_confirmation_code,
          email_confirmation_code_sent_at: new Date(),
          verification_code: {
            create: {},
          },
        },
      })

      await this.mailService.sendEmailConfirmation(
        email,
        email_confirmation_code,
      )
      return "User registered successfully, please check your email to confirm your account"
    } catch (e) {
      throw new ServiceUnavailableException(
        "Registration failed, please try again later",
      )
    }
  }

  async confirmEmail(code: string) {
    try {
      await this.prisma.user.update({
        where: { email_confirmation_code: code },
        data: {
          email_verified: true,
          email_confirmation_code: null,
          email_confirmation_code_sent_at: null,
        },
      })

      return "Email confirmed successfully, you can now log in"
    } catch (e) {
      throw new NotFoundException()
    }
  }
}
