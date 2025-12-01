import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class UpdateTransactionEventDto {
  @IsString()
  @IsNotEmpty()
  client: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  code: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  description: string;
}
