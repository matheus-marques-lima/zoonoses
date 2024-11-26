import { IsEnum } from 'class-validator';
import { ScheduleStatus } from '../enums/status.enum';

export class UpdateScheduleDto {
  @IsEnum(ScheduleStatus)
  status: ScheduleStatus;
}
