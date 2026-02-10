import { Controller, Get, UseGuards } from "@nestjs/common"
import { AppService } from "./app.service"
import { AuthGuard } from "./auth/auth.guard"
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getStatus(): string {
    return this.appService.getStatus()
  }

  @UseGuards(AuthGuard)
  @Get("protected")
  getProtectedRoute(): string {
    return this.appService.protectedRoute()
  }
}
