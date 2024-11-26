"use client";

import "./page.css";
import Table from "@/components/Table";
import Pet from "@/@types/pets/pet.entity";
import useUser from "@/hooks/use-user.hook";
import {redirect} from "next/navigation";
import useAPI, {api} from "@/hooks/use-api.hook";
import {FormEvent, useEffect, useState} from "react";
import CreatePetDto from "@/@types/pets/dto/create-pet.dto";
import FormBox from "@/components/FormBox";
import FormItem from "@/components/FormItem";

export default function App() {
    const {user, isLoading} = useUser();
    const {data, mutate} = useAPI<Pet[]>('/pets?me=true');

    const [pet, setPet] = useState<CreatePetDto>({
        name: '',
        race: '',
        birth: '',
    });
    const [setup, setSetup] = useState<boolean>(false);

    useEffect(() => {
        if (!user && !isLoading) {
            redirect('/auth/login');
        }
    }, [user, isLoading]);

    if (isLoading)
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
            await api.post('/pets', pet);
        } catch {
        }

        await mutate();

        setPet({
            name: '',
            race: '',
            birth: '',
        });

        setSetup(false);
    };

    return (
        <div className="body">
            <h1>Seja bem-vindo!</h1>

            <div>
                <p><strong>Nome:</strong> {user?.name}</p>
                <p><strong>Email:</strong> {user?.email}</p>
            </div>

            <h1>Registros</h1>

            <Table
                titles={["ID", "Apelido", "Raça", "Idade", "Ações"]}
                values={data?.map((props) => [
                    props.id,
                    props.name,
                    props.race,
                    new Date(props.birth).toLocaleDateString(),
                    (
                        <a href={`/pets/${props.id}`} key={props.id}>
                            Ver
                        </a>
                    ),
                ])}
            />

            {setup && <div className="setup">
                <FormBox submit={handleSubmit}>
                    <FormItem
                        name="name"
                        type="text"
                        label="Apelido"
                        placeholder="Digite o apelido"
                        value={pet?.name}
                        onChange={(e) => setPet({...pet, name: e.target.value})}
                        required
                    />
                    <FormItem
                        name="race"
                        type="text"
                        label="Raça"
                        placeholder="Digite a raça"
                        value={pet?.race}
                        onChange={(e) => setPet({...pet, race: e.target.value})}
                        required
                    />
                    <FormItem
                        name="birth"
                        type="date"
                        label="Idade"
                        placeholder="Selecione o nascimento"
                        value={pet?.birth}
                        onChange={(e) => setPet({...pet, birth: e.target.value})}
                        required
                    />

                    <div className="setup-buttons">
                        <button id="send-button" type="submit">Criar</button>
                        <button onClick={() => setSetup(false)}>Sair</button>
                    </div>
                </FormBox>
            </div>}

            <button onClick={() => setSetup(!setup)}>
                Cadastrar novo animal
            </button>
        </div>
    );
}