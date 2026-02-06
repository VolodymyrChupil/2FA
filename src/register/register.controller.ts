import { Body, Controller, Post, Get, Param } from "@nestjs/common"
import { RegisterService } from "./register.service"
import { CreateUserDto } from "./register.dto"
import { ApiTags, ApiBody, ApiParam } from "@nestjs/swagger"
import { Throttle } from "@nestjs/throttler"

@ApiTags("register")
@Controller("register")
@Throttle({ default: { limit: 5 } })
export class RegisterController {
  constructor(private readonly registerService: RegisterService) {}

  @Post()
  @ApiBody({ type: CreateUserDto })
  createUser(@Body() body: CreateUserDto) {
    return this.registerService.createUser(body)
  }

  @Get(":code")
  @ApiParam({ name: "code", description: "Email confirmation code" })
  confirmEmail(@Param("code") code: string) {
    return this.registerService.confirmEmail(code)
  }
}
