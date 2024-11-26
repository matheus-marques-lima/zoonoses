'use client';

import {createContext, ReactNode} from "react";
import useAPI from "@/hooks/use-api.hook";
import {User} from "@/@types/users/user.entity";
import {redirect} from "next/navigation";
import {deleteCookie} from 'cookies-next';

type UserContextType = {
    user: User | undefined;
    isLoading: boolean;
    logout: () => void;
};

export const UserContext = createContext<UserContextType>({
    user: undefined,
    isLoading: true,
    logout: () => {
    },
});

type UserParamsProps = {
    children: ReactNode;
};

export function UserWrapper({children}: UserParamsProps) {
    const {data: user, isLoading} = useAPI<User>('/auth/me');

    const logout = async () => {
        deleteCookie('token', {path: '/'});
        redirect('/');
    };

    return (
        <UserContext.Provider value={{logout, user, isLoading}}>
            {children}
        </UserContext.Provider>
    );
}
