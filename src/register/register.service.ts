import {
  Injectable,
  ConflictException,
  ServiceUnavailableException,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common"
import { CreateUserDto } from "./register.dto"
import { User } from "src/models/user.model"
import * as bcrypt from "bcrypt"
import * as crypto from "crypto"
import { MailService } from "src/mail/mail.service"

@Injectable()
export class RegisterService {
  constructor(private readonly mailService: MailService) {}

  async createUser(body: CreateUserDto) {
    const { username, email, password } = body

    const duplicate = await User.findOne({ email }).lean().exec()
    if (duplicate) throw new ConflictException("This email already exists")

    try {
      const hashedPwd = await bcrypt.hash(password, 10)

      const user = await User.create({
        username,
        email,
        password: hashedPwd,
      })

      const confirmationCode = `${user._id}${crypto.randomBytes(40).toString("hex")}`
      user.emailConfirmationCode = confirmationCode
      await user.save()

      this.mailService.sendEmailConfirmation(email, confirmationCode)

      return `Success, user: ${username} created. We send confirmation letter on your email.`
    } catch (err) {
      throw new ServiceUnavailableException("Registration failed")
    }
  }

  async confirmEmail(code: string) {
    if (!code) throw new BadRequestException()
    const userId = code.slice(0, 24)
    const foundUser = await User.findById(userId).exec()

    if (!foundUser) throw new NotFoundException()
    if (foundUser.emailConfirmationCode !== code) throw new NotFoundException()

    foundUser.emailConfirmed = true
    foundUser.emailConfirmationCode = null
    await foundUser.save()

    return "Success, email confirmed!"
  }
}
