import {ScheduleStatus} from "@/@types/schedules/enum/status.enum";
import Pet from "@/@types/pets/pet.entity";
import {User} from "@/@types/users/user.entity";
import {ScheduleType} from "@/@types/schedules/enum/type.enum";

export default interface Schedule {
    id: number;
    scheduledAt: string;
    status: ScheduleStatus;
    type: ScheduleType;
    createdAt: string;
    updatedAt: string;
    pet: Pet;
    user: User;
}
