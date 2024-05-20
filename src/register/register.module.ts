import { Module } from "@nestjs/common"
import { RegisterController } from "./register.controller"
import { RegisterService } from "./register.service"
import { MailModule } from "src/mail/mail.module"

@Module({
  controllers: [RegisterController],
  providers: [RegisterService],
  imports: [MailModule],
})
export class RegisterModule {}
