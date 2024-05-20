import { Injectable } from "@nestjs/common"
import { MailerService } from "@nestjs-modules/mailer"

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  sendEmailConfirmation(email: string, code: string) {
    this.mailerService.sendMail({
      to: email,
      from: `2FA <${process.env.EMAIL_ADDRESS}>`,
      subject: "Email Address Confirmation",
      html: `Thank you for registering on our website 2FA <br>
      To confirm your email follow this <a href="${process.env.SERVER_URL}/register/${code}">link</a><br>
      If you did not request this email confirmation disregard this email<br>.
      Sincerely,<br>
      2FA Team`,
    })
  }

  sendVerificationCode(email: string, code: string) {
    this.mailerService.sendMail({
      to: email,
      from: `2FA <${process.env.EMAIL_ADDRESS}>`,
      subject: "2FA Security Code",
      html: `Hi! Here is a temporary security code for your 2FA Account. It can only be used once within the next <b>5</b> minutes, after which it will expire:<br>
      <b>${code}</b><br>
      Did you receive this email without having an active request from 2FA to enter a verification code? If so, the security of your 2FA account may be compromised. Please <b>change your password as soon as possible.</b><br>
      Sincerely,<br>
      2FA Team`,
    })
  }
}
