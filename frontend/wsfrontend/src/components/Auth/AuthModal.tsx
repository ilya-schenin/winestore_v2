"use client";

import React, { useState } from "react";
import styles from './Auth.module.css';
import { Login } from "./Login";
import { Register } from "./Register";
import { FormType } from "./types";
import cn from 'classnames';
import { useAppSelector, useAppDispatch } from '../../../redux-toolkit/hooks';
import { toggleModal } from "../../../redux-toolkit/slices/authSlice";

export const AuthModal: React.FC = () => {

    const [showForm, setShowForm] = useState<FormType>('login');
    const authState = useAppSelector((state) => state.authModal);
    const dispatch = useAppDispatch();
    
    return (
        <div className={cn(styles.AuthModal, {
            [styles.Closed]: !authState
        })}>
            <div className={styles.Content}>
                <div className={styles.Cross} onClick={() => {
                    dispatch(toggleModal());
                    setShowForm('login');
                }}>
                    <div className={styles.Line}></div>
                    <div className={styles.Line}></div>
                </div>
                {showForm == 'login' && <Login setShowForm={setShowForm} />}
                {showForm == 'register' && <Register />}
            </div>
        </div>
    );
};