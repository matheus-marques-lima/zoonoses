import {ScheduleStatus} from "@/@types/schedules/enum/status.enum";

export default interface UpdateScheduleDto {
    status: ScheduleStatus;
}
