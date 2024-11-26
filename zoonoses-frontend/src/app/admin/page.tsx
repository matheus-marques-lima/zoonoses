'use client';

import "./page.css";

import Table from "@/components/Table";
import useUser from "@/hooks/use-user.hook";
import {useEffect} from "react";
import {redirect} from "next/navigation";
import useAPI, {api} from "@/hooks/use-api.hook";
import Schedule from "@/@types/schedules/schedule.entity";

const translatedType = {
    VACCINE: 'Vacina',
    COLLAR: 'Coleira',
}

export default function App() {
    const {user, isLoading} = useUser();
    const {data, mutate} = useAPI<Schedule[]>('/schedule');

    useEffect(() => {
        if ((!user || !user.roles.includes('admin')) && !isLoading) {
            redirect('/auth/login');
        }
    }, [user, isLoading]);

    if (isLoading)
        return (
            <div className="body">
                <h1>Carregando, aguarde...</h1>
            </div>
        );

    async function handleChange(id: number, status: string) {
        await api.patch(`/schedule/${id}`, {
            status
        });
        await mutate();
    }

    return (
        <div className="body">
            <h1>Lista de agendamentos</h1>

            <Table
                titles={["ID", "Agendamento", "Tutor", "Apelido", "Raça", "Nascimento", "Tipo", "Status"]}
                values={data?.map((props) => [
                    props.id,
                    new Date(props.scheduledAt).toLocaleDateString(),
                    props.user.name,
                    props.pet.name,
                    props.pet.race,
                    new Date(props.pet.birth).toLocaleDateString(),
                    translatedType[props.type],
                    (
                        <form key={props.id} onSubmit={() => {
                        }}>
                            <select
                                value={props.status}
                                onChange={(e) => handleChange(props.id, e.target.value)}
                            >
                                <option value="PENDING">Analise</option>
                                <option value="DENIED">Reagendar</option>
                                <option value="APPROVED">Aprovado</option>
                                <option value="COMPLETE">Completo</option>
                            </select>
                        </form>
                    )
                ])}
            />
        </div>
    );
}
