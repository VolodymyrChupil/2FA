import { IsNotEmpty, Length, IsStrongPassword, IsEmail } from "class-validator"

export class UpdatePwdDto {
  @IsNotEmpty()
  password: string

  @Length(12, 32)
  @IsStrongPassword()
  newPassword: string

  verificationCode?: string
}

export class ResetPwdDto {
  @IsEmail()
  email: string

  @Length(12, 32)
  @IsStrongPassword()
  newPassword?: string
}
