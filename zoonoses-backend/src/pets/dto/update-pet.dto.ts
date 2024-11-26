import { IsDate, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdatePetDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  race?: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  birth?: Date;
}
