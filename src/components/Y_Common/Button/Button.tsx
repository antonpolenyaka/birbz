import {FC} from "react";
import * as React from "react";
import style from "./Button.module.scss"

interface IButton extends React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {
    label: string
    className?: string
    onClick?: any
}

export const Button:FC<IButton> = ({
                                       label,
                                       className,
                                       onClick
}) => {
    return (
        <button className={style.button} onClick={onClick}>
            {label}
        </button>
    )
}