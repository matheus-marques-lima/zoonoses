import { IsDate, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreatePetDto {
  @IsString()
  name: string;

  @IsString()
  race: string;

  @Type(() => Date)
  @IsDate()
  birth: Date;
}
