import { Module } from "@nestjs/common"
import { RegisterService } from "./register.service"
import { RegisterController } from "./register.controller"
import { PrismaModule } from "src/prisma/prisma.module"
import { MailModule } from "src/mail/mail.module"

@Module({
  providers: [RegisterService],
  controllers: [RegisterController],
  imports: [PrismaModule, MailModule],
})
export class RegisterModule {}
