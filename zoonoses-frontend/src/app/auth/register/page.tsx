"use client";

import "./page.css";

import {FormEvent, useState} from "react";
import FormBox from "@/components/FormBox";
import FormItem from "@/components/FormItem";
import {api} from "@/hooks/use-api.hook";
import {useRouter} from "next/navigation";
import CreateUserDto from "@/@types/users/dto/create-user.dto";

export default function Register() {
    const [user, setUser] = useState<CreateUserDto>({
        name: "",
        email: "",
        password: "",
    });

    const [loading, setLoading] = useState<boolean>(false);

    const router = useRouter();

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (loading) {
            return;
        } else {
            setLoading(true);
        }

        api.post('/auth/register', {
            name: user.name,
            email: user.email,
            password: user.password
        })
            .then(() => router.push('/auth/login'))
            .catch(() => {
                const errorMessage = document.getElementById('error-message');

                if (errorMessage) {
                    errorMessage.style.display = 'block';
                }

                setLoading(false);
            });
    };

    return (
        <div className="body">
            <FormBox submit={handleSubmit}>
                <h1>Criar uma nova conta</h1>
                <p style={{color: "red", display: "none"}} id='error-message'>Os dados informados sao inválidos,
                    verifique.</p>

                <FormItem
                    name="name"
                    type="text"
                    label="Nome completo"
                    placeholder="Digite seu nome"
                    value={user.name}
                    onChange={(e) => setUser({...user, name: e.target.value})}
                    required
                />
                <FormItem
                    name="email"
                    type="email"
                    label="Email"
                    placeholder="Digite seu email"
                    value={user.email}
                    onChange={(e) => setUser({...user, email: e.target.value})}
                    required
                />
                <FormItem
                    name="password"
                    type="password"
                    label="Senha"
                    placeholder="Digite sua senha"
                    value={user.password}
                    onChange={(e) => setUser({...user, password: e.target.value})}
                    required
                />

                <button type="submit">Registrar</button>

                <p>Já tem uma conta? <a href="/auth/login">Conecte-se</a></p>
            </FormBox>
        </div>
    );
}
