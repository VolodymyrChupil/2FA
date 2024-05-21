import { IsEmail, Length, MaxLength, IsStrongPassword } from "class-validator"

export class CreateUserDto {
  @Length(3, 32)
  username: string

  @MaxLength(64)
  @IsEmail()
  email: string

  @Length(12, 32)
  @IsStrongPassword()
  password: string
}
