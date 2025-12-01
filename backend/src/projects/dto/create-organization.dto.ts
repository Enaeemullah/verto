import { IsEnum, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateOrganizationDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  por_orgadesc: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  por_orgacode: string;

  @IsEnum(['active', 'inactive'])
  por_active: 'active' | 'inactive';
}
