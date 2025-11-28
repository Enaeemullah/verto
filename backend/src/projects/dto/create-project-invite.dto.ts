import { IsEmail } from 'class-validator';

export class CreateProjectInviteDto {
  @IsEmail()
  email: string;
}
