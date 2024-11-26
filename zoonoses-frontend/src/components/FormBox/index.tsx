import React, {FormEvent, ReactNode} from "react";
import "./index.css";

interface FormBoxProps {
    children: ReactNode;
    submit: (event: FormEvent<HTMLFormElement>) => void;
}

export default function FormBox({children, submit}: FormBoxProps) {
    return (
        <form className="form-box" onSubmit={submit}>
            {children}
        </form>
    );
}
