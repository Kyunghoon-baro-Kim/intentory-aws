import { IsEmail, IsNotEmpty, IsEnum, MinLength } from 'class-validator';
import { Role } from '@prisma/client';

export class RegisterDto {
  @IsEmail()
  email: string;

  @MinLength(8)
  password: string;

  @IsNotEmpty()
  name: string;

  @IsEnum(Role)
  role: Role;
}

export class LoginDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;
}

export class CreateAdminDto {
  @IsEmail()
  email: string;

  @MinLength(8)
  password: string;

  @IsNotEmpty()
  name: string;

  @IsEnum(Role)
  role: Role;
}
