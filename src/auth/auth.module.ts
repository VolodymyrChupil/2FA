import { Module } from "@nestjs/common"
import { AuthService } from "./auth.service"
import { AuthController } from "./auth.controller"
import { PrismaModule } from "../prisma/prisma.module"
import { MailModule } from "src/mail/mail.module"
import { JwtModule } from "@nestjs/jwt"

@Module({
  imports: [PrismaModule, MailModule, JwtModule],
  providers: [AuthService],
  controllers: [AuthController],
  exports: [JwtModule, AuthService],
})
export class AuthModule {}
