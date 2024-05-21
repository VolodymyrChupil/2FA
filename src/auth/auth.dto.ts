import { IsNotEmpty, Length, IsStrongPassword } from "class-validator"

export class UpdatePwdDto {
  @IsNotEmpty()
  password: string

  @Length(12, 32)
  @IsStrongPassword()
  newPassword: string

  verificationCode?: string
}
