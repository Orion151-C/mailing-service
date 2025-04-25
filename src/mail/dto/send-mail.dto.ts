import { IsEmail, IsNotEmpty, MaxLength } from 'class-validator';

export class SendMailDto {
  @IsEmail() to: string;

  @IsNotEmpty()
  @MaxLength(120)
  subject: string;

  @IsNotEmpty()
  body: string;
}
