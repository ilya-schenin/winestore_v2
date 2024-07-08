"use client";

import React, { useState } from "react";
import { User } from "@/api/interfaces";
import { useForm } from "react-hook-form";
import { Input } from "../Input/Input";
import { Button } from "../Button/Button";
import styles from './Auth.module.css';
import { registerUser } from "@/api/auth";
import { ResponseStatus } from "@/api/interfaces";

export interface RegisterForm extends User {
    password: string,
    confirm_password: string
}

export const Register: React.FC = () => {

    const { register, handleSubmit, formState: { errors }} = useForm<RegisterForm>();
    const [message, setMessage] = useState<null | ResponseStatus>(null);

    const onSubmit = (data: RegisterForm) => {
        registerUser(data, setMessage);
    };

    return (
        <form action="." method="post" onSubmit={handleSubmit(onSubmit)}>
            {message && <span style={
                message.statusCode == 200 ? {color:'green'} : {color: 'red'}
                } >{message.message}</span>
            }
            <h2>Регистрация</h2>
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
            <div className={styles.regBlocks}>
                <div className={styles.Block}>
                    <p>Имя</p>
                    <Input type="text" error={errors.first_name} {...register(
                        'first_name', {
                            required: {
                                value: true,
                                message: 'Заполните поле <i>имя</i>'
                            },
                            minLength: 2
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
                </div>
                <div className={styles.Block}>
                <p>Фамилия</p>
                    <Input type="text" error={errors.last_name} {...register(
                        'last_name', {
                            required: {
                                value: true,
                                message: 'Заполните поле <i>фамилия</i>'
                            },
                            minLength: 2
                        }
                    )} />
                    <p>Подтвердите пароль</p>
                    <Input type="password" error={errors.confirm_password} {...register(
                        'confirm_password', { 
                            required: { 
                                value: true,
                                message: 'Заполните поле <i>подтвердите пароль</i>'
                            }
                        }
                    )} />
                </div>
            </div>
            <p>
                <Button title="Зарегестрироваться" type="submit" typeOf="primary"/>
            </p>
        </form>
    );
};