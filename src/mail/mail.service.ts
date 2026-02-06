import { Injectable } from "@nestjs/common"
import { MailerService } from "@nestjs-modules/mailer"

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  sendEmailConfirmation(to: string, code: string) {
    return this.mailerService.sendMail({
      to,
      subject: "2FA Confirmation Code",
      template: "email-confirmation",
      context: {
        code,
        server_url: process.env.SERVER_URL,
      },
    })
  }
}
