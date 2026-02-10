import { ApiProperty } from "@nestjs/swagger"
import { IsOptional, IsNotEmpty, IsString } from "class-validator"
export class LoginDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  username: string

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  password: string

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  verificationCode?: string
}
