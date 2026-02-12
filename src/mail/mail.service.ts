import { Injectable } from "@nestjs/common"
import { MailerService } from "@nestjs-modules/mailer"

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  sendEmailConfirmation(to: string, code: string) {
    return this.mailerService.sendMail({
      to,
      subject: "2FA Email Confirmation",
      template: "email-confirmation",
      context: {
        code,
        server_url: process.env.SERVER_URL,
      },
    })
  }

  sendVerificationCode(to: string, code: string) {
    return this.mailerService.sendMail({
      to,
      subject: "2FA Verification Code",
      template: "verification-code",
      context: {
        code,
      },
    })
  }
}
