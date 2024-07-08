import React, { DetailedHTMLProps, InputHTMLAttributes, forwardRef } from "react";
import styles from './Input.module.css';
import { FieldError } from "react-hook-form";

interface InputProps extends DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
  error?: FieldError;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({ error, ...props }, ref) => {
  return (
    <>
      <input className={styles.Input} ref={ref} {...props} />
      {error?.message && 
        <span className={styles.Error} dangerouslySetInnerHTML={{ __html: error.message }} />
      }
    </>
  );
});

Input.displayName = 'Input';
