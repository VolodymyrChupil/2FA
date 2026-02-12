import { ApiProperty } from "@nestjs/swagger"
import { IsEmail, IsStrongPassword, Length, MaxLength } from "class-validator"

export class CreateUserDto {
  @ApiProperty()
  @IsEmail()
  @MaxLength(128)
  email: string

  @ApiProperty()
  @Length(3, 50)
  username: string

  @ApiProperty()
  @IsStrongPassword({ minLength: 12 })
  password: string
}
