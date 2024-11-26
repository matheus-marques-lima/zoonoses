import { IsDate, IsEnum, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { ScheduleType } from '../enums/type.enum';

export class CreateScheduleDto {
  @IsNumber()
  petId: number;

  @Type(() => Date)
  @IsDate()
  scheduledAt: Date;

  @IsEnum(ScheduleType)
  type: ScheduleType;
}
