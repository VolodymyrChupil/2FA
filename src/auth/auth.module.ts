import { Module } from "@nestjs/common"
import { AuthService } from "./auth.service"
import { AuthController } from "./auth.controller"
import { MailModule } from "src/mail/mail.module"
import { JwtModule } from "@nestjs/jwt"

@Module({
  providers: [AuthService],
  controllers: [AuthController],
  imports: [MailModule, JwtModule],
})
export class AuthModule {}
