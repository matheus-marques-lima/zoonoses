import "./index.css";
import React, {ChangeEvent, ReactNode} from 'react';

interface FormItemProps {
    label: string;
    name: string;
    type: string;
    placeholder?: string;
    value?: string;
    onChange?: (e: ChangeEvent<HTMLSelectElement | HTMLInputElement>) => void;
    required?: boolean;
    children?: ReactNode;
}

export default function FormItem(props: FormItemProps) {
    return (
        <div className="form-input">
            <label htmlFor={props.name}>{props.label}</label>

            {props.type === "select" ? (
                <select
                    name={props.name}
                    value={props.value}
                    onChange={props.onChange}
                    required={props.required}
                >
                    {props.children}
                </select>
            ) : (
                <input
                    name={props.name}
                    type={props.type}
                    placeholder={props.placeholder}
                    value={props.value}
                    onChange={props.onChange}
                    required={props.required}
                />
            )}
        </div>
    );
}
