import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common"
import { Observable } from "rxjs"
import { JwtService } from "@nestjs/jwt"
import { Request } from "express"
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwt: JwtService) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: Request = context.switchToHttp().getRequest()
    const authHeader = request.headers["authorization"]
    if (!authHeader?.startsWith("Bearer ")) {
      return false
    }

    const token = authHeader.split(" ")[1]
    try {
      const payload = this.jwt.verify<{ userId: string }>(token, {
        secret: process.env.ACCESS_TOKEN,
      })
      request.userId = payload.userId
      return true
    } catch {
      return false
    }
  }
}
