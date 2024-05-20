import {
  Controller,
  Post,
  Get,
  Body,
  ValidationPipe,
  Param,
} from "@nestjs/common"
import { CreateUserDto } from "./register.dto"
import { RegisterService } from "./register.service"
import { Throttle } from "@nestjs/throttler"

@Controller("register")
@Throttle({ default: { limit: 3 } })
export class RegisterController {
  constructor(private readonly registerService: RegisterService) {}

  @Post()
  createUser(@Body(ValidationPipe) body: CreateUserDto) {
    return this.registerService.createUser(body)
  }

  @Get(":code")
  confirmEmail(@Param("code") code: string) {
    return this.registerService.confirmEmail(code)
  }
}
