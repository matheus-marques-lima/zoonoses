"use client";

import "./page.css";
import {FormEvent, useEffect, useState} from "react";
import useUser from "@/hooks/use-user.hook";
import useAPI, {api} from "@/hooks/use-api.hook";
import Pet from "@/@types/pets/pet.entity";
import {redirect, useParams} from "next/navigation";
import Schedule from "@/@types/schedules/schedule.entity";
import Table from "@/components/Table";
import CreateScheduleDto from "@/@types/schedules/dto/create-schedule.dto";
import FormItem from "@/components/FormItem";
import FormBox from "@/components/FormBox";
import {ScheduleType} from "@/@types/schedules/enum/type.enum";

const translatedStatus = {
    PENDING: 'Pendente',
    DENIED: 'Reagendar',
    APPROVED: 'Aprovado',
    COMPLETE: 'Completo',
}

const translatedType = {
    VACCINE: 'Vacina',
    COLLAR: 'Coleira',
}

export default function App() {
    const params = useParams();

    const {user, isLoading: isUserLoading} = useUser();
    const {data: pet, isLoading: isPetLoading} = useAPI<Pet>(`/pets/${params.id}`);
    const {data, mutate} = useAPI<Schedule[]>(`/schedule?pet=${params.id}`);

    const [schedule, setSchedule] = useState<CreateScheduleDto>({
        petId: parseInt(params.id as string),
        scheduledAt: '',
        type: ScheduleType.VACCINE
    });
    const [setup, setSetup] = useState<boolean>(false);

    useEffect(() => {
        if (!user && !isUserLoading) {
            redirect('/auth/login');
        }

        if (!pet && !isPetLoading) {
            redirect('/auth/login');
        }

        if (pet?.user?.id !== user?.id && !isPetLoading && !isUserLoading) {
            redirect('/auth/login');
        }
    }, [user, pet, isUserLoading, isPetLoading]);

    if (isUserLoading || isPetLoading)
        return (
            <div className="body">
                <h1>Carregando, aguarde...</h1>
            </div>
        );

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const sendButton = document.getElementById('send-button');

        if (sendButton) {
            sendButton.style.display = 'none';
        }

        try {
            await api.post('/schedule', schedule);
        } catch {
        }

        await mutate();

        setSchedule({
            petId: parseInt(params.id as string),
            scheduledAt: '',
            type: ScheduleType.VACCINE
        });

        setSetup(false);
    };

    return (
        <div className="body">
            <h1>Detalhes do Animal</h1>

            <div>
                <p><strong>Apelido:</strong> {pet?.name}</p>
                <p><strong>Raça:</strong> {pet?.race}</p>
                <p><strong>Nascimento:</strong> {pet ? new Date(pet.birth).toLocaleDateString() : null}</p>
            </div>

            <h2>Registros</h2>

            <Table
                titles={["ID", "Agendamento", "Status", "Tipo"]}
                values={data?.map((props) => [
                    props.id,
                    new Date(props.scheduledAt).toLocaleDateString(),
                    translatedStatus[props.status],
                    translatedType[props.type],
                ])}
            />

            {setup && <div className="setup">
                <FormBox submit={handleSubmit}>
                    <FormItem
                        name="date"
                        type="date"
                        label="Data"
                        placeholder="Digite a data"
                        value={schedule.scheduledAt}
                        onChange={(e) => setSchedule({...schedule, scheduledAt: e.target.value})}
                        required
                    />
                    <FormItem
                        name="type"
                        type="select"
                        label="Tipo"
                        placeholder="Selecione o tipo"
                        value={schedule.type === ScheduleType.COLLAR ? 'COLLAR' : 'VACCINE'}
                        onChange={(e) => setSchedule({
                            ...schedule,
                            type: e.target.value === 'COLLAR' ? ScheduleType.COLLAR : ScheduleType.VACCINE
                        })}
                        required
                    >
                        <option value="">Selecione o tipo</option>
                        <option value="COLLAR">COLEIRA</option>
                        <option value="VACCINE">VACINAÇÃO</option>
                    </FormItem>

                    <div className="setup-buttons">
                        <button id="send-button" type="submit">Criar</button>
                        <button onClick={() => setSetup(false)}>Sair</button>
                    </div>
                </FormBox>
            </div>}

            <button onClick={() => setSetup(!setup)}>
                Criar agendamento
            </button>
        </div>
    );
}