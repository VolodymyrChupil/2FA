import { Controller, Post, Req, Res, Body, Get } from "@nestjs/common"
import { ApiTags, ApiBody, ApiOperation } from "@nestjs/swagger"
import { Throttle, SkipThrottle } from "@nestjs/throttler"
import { AuthService } from "./auth.service"
import { LoginDto } from "./auth.dto"
import { Request, Response } from "express"

@ApiTags("auth")
@Controller("auth")
@Throttle({ default: { limit: 5 } })
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("login")
  @ApiBody({ type: LoginDto })
  @ApiOperation({ summary: "Login a user" })
  login(@Req() req: Request, @Res() res: Response, @Body() body: LoginDto) {
    return this.authService.login(req, res, body)
  }

  @SkipThrottle()
  @Get("refresh")
  @ApiOperation({ summary: "Refresh access token" })
  refresh(@Req() req: Request, @Res() res: Response) {
    return this.authService.refresh(req, res)
  }

  @Get("logout")
  @ApiOperation({ summary: "Logout a user" })
  logout(@Req() req: Request, @Res() res: Response) {
    return this.authService.logout(req, res)
  }
}
