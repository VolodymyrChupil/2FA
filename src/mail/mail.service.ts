import { Injectable } from "@nestjs/common"
import { MailerService } from "@nestjs-modules/mailer"
import {
  sendEmailConfirmationTMP,
  sendVerificationCodeTMP,
  sendPasswordChangeCodeTMP,
  sendResetPasswordConfirmationTMP,
} from "./mail.template"

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  sendEmailConfirmation(email: string, code: string) {
    this.mailerService.sendMail({
      to: email,
      from: `2FA <${process.env.EMAIL_ADDRESS}>`,
      subject: "Email Address Confirmation",
      html: sendEmailConfirmationTMP(code),
    })
  }

  sendVerificationCode(email: string, code: string) {
    this.mailerService.sendMail({
      to: email,
      from: `2FA <${process.env.EMAIL_ADDRESS}>`,
      subject: "Security Code",
      html: sendVerificationCodeTMP(code),
    })
  }

  sendChangePasswordCode(email: string, code: string) {
    this.mailerService.sendMail({
      to: email,
      from: `2FA <${process.env.EMAIL_ADDRESS}>`,
      subject: "Password change",
      html: sendPasswordChangeCodeTMP(code),
    })
  }

  sendResetPasswordConfirmation(email: string, code: string) {
    this.mailerService.sendMail({
      to: email,
      from: `2FA <${process.env.EMAIL_ADDRESS}>`,
      subject: "Reset password",
      html: sendResetPasswordConfirmationTMP(code),
    })
  }
}
