import { IsNotEmpty, Length, IsStrongPassword, IsEmail } from "class-validator"

export class UpdatePwdDto {
  @IsNotEmpty()
  password: string

  @Length(12, 32)
  @IsStrongPassword()
  newPassword: string

  verificationCode?: string
}

export class RequestPasswordResetDto {
  @IsNotEmpty()
  @IsEmail()
  email: string
}

export class ResetPwdDto {
  @Length(12, 32)
  @IsStrongPassword()
  newPassword?: string
}
