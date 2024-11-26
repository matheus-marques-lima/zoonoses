import {ScheduleType} from "@/@types/schedules/enum/type.enum";

export default interface CreateScheduleDto {
    petId: number;
    scheduledAt: string;
    type: ScheduleType;
}
