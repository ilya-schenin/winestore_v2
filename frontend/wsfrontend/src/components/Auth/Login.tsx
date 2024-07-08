 "use client";

import React, { useEffect, useState } from "react";
import { Input } from "../Input/Input";
import { Button } from "../Button/Button";
import { useForm } from "react-hook-form";
import { User } from "@/api/interfaces";
import { loginUser } from "@/api/auth";
import { FormType } from "./types";
import { ResponseStatus } from "@/api/interfaces";


export interface LoginForm extends Pick<User, 'email'> {
    password: string
}

interface LoginProps {
    setShowForm: React.Dispatch<React.SetStateAction<FormType>>;
  }

export const Login: React.FC<LoginProps> = ({ setShowForm }) => {
    
    const { register, handleSubmit, formState: { errors }} = useForm<LoginForm>();
    const [message, setMessage] = useState<null | ResponseStatus>(null);

    const onSubmit = (data: LoginForm) => {
        loginUser(data, setMessage);        
    };

    useEffect(() => {
        setTimeout(() => {
            setMessage(null);
            message?.statusCode == 200 && window.location.reload();
        }, 1000);
    }, [message]);

    return (
        <form action="." method="post" onSubmit={handleSubmit(onSubmit)}>
            <h2>Авторизация</h2>
            {message && <span style={
                message.statusCode == 200 ? {color:'green'} : {color: 'red'}
                } >{message.message}</span>
            }
            <p>Email</p>
            <Input type="text" error={errors.email} {...register(
                'email', { 
                    required: { 
                        value: true, 
                        message: 'Заполните поле <i>email</i>'
                    },
                    pattern: {
                        value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                        message: 'Введите валидный <i>email</i>'
                      }
                }
                )} />
            <p>Пароль</p>
            <Input type="password" error={errors.password} {...register(
                 'password', { 
                    required: { 
                        value: true,
                        message: 'Заполните поле <i>пароль</i>'
                    }
                }
            )} />
            <p>
                <Button title="Войти" type="submit" typeOf="primary"/>
            </p>
            <hr />
            <p style={{display:'flex', justifyContent: 'center'}}>
                <Button 
                    type="button"
                    typeOf="ghost" 
                    title="Зарегестрироваться"
                    onClick={() => setShowForm('register')} 
                />
            </p>
        </form>
    );
};