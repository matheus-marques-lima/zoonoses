import {User} from "@/@types/users/user.entity";

export default interface Pet {
    id: number;
    name: string;
    race: string;
    birth: string;
    createdAt: string;
    updatedAt: string;
    user: User;
}
