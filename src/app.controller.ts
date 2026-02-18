import { Controller, Get, UseGuards } from "@nestjs/common"
import { AppService } from "./app.service"
import { AuthGuard } from "./auth/auth.guard"
import { ApiBearerAuth, ApiOperation } from "@nestjs/swagger"
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: "Get server status" })
  getStatus(): string {
    return this.appService.getStatus()
  }

  @UseGuards(AuthGuard)
  @Get("protected")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get protected route" })
  getProtectedRoute(): string {
    return this.appService.protectedRoute()
  }
}
