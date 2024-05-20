import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common"
import { Observable } from "rxjs"
import { JwtService } from "@nestjs/jwt"

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest()

    const authHeader = request.headers.authorization
    if (!authHeader?.startsWith("Bearer ")) return false
    const token = authHeader.split(" ")[1]

    try {
      const payload = this.jwtService.verify(token, {
        secret: process.env.ACCESS_TOKEN,
      })
      request.userId = payload.id
      return true
    } catch (err) {
      return false
    }
  }
}
