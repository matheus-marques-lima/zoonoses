"use client";

import "./page.css";

import {FormEvent, useState} from "react";
import FormBox from "@/components/FormBox";
import FormItem from "@/components/FormItem";
import {api} from "@/hooks/use-api.hook";
import {useRouter} from "next/navigation";
import {setCookie} from "cookies-next";

export default function Register() {
    const [user, setUser] = useState({
        email: "",
        password: ""
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

        api.post('/auth/login', {
            email: user.email,
            password: user.password
        })
            .then(res => {
                setCookie('token', res.data.access_token, {path: '/'});
                router.push('/');
            })
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
                <h1>Entrar em sua conta</h1>
                <p style={{color: "red", display: "none"}} id='error-message'>Os dados informados sao inválidos,
                    verifique.</p>

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

                <button type="submit">Entrar</button>

                <p>Não tem uma conta? <a href="/auth/register">Cadastra-se</a></p>
            </FormBox>
        </div>
    );
}
