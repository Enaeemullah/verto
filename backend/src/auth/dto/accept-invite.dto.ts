import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class AcceptInviteDto {
  @IsString()
  @IsNotEmpty()
  token: string;

  @IsString()
  @IsOptional()
  password?: string;
}
