import {
  Controller,
  Post,
  Get,
  Req,
  Res,
  Body,
  UseGuards,
  ValidationPipe,
  Param,
} from "@nestjs/common"
import { Request, Response } from "express"
import { AuthService } from "./auth.service"
import { AuthGuard } from "./auth.guard"
import { LoginBody } from "./auth.interface"
import { UpdatePwdDto, ResetPwdDto, RequestPasswordResetDto } from "./auth.dto"
import { Throttle } from "@nestjs/throttler"

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Throttle({ default: { limit: 5 } })
  @Post("login")
  login(@Req() req: Request, @Res() res: Response, @Body() body: LoginBody) {
    return this.authService.login(req, res, body)
  }

  @Get("logout")
  logout(@Req() req: Request, @Res() res: Response) {
    return this.authService.logout(req, res)
  }

  @Get("refresh")
  refresh(@Req() req: Request, @Res() res: Response) {
    return this.authService.refresh(req, res)
  }

  @UseGuards(AuthGuard)
  @Post("change-pwd")
  changePassword(
    @Req() req: Request,
    @Res() res: Response,
    @Body(ValidationPipe) body: UpdatePwdDto,
  ) {
    return this.authService.changePassword(req, res, body)
  }

  @Post("reset-pwd")
  resetPassword(
    @Res() res: Response,
    @Body(ValidationPipe) body: RequestPasswordResetDto,
  ) {
    return this.authService.requestPasswordReset(res, body)
  }

  @Throttle({ default: { limit: 5 } })
  @Get("reset-pwd/:code")
  confirmPasswordReset(
    @Param("code") code: string,
    @Body(ValidationPipe) newPassword: ResetPwdDto,
  ) {
    return this.authService.resetPassword(code, newPassword)
  }
}
