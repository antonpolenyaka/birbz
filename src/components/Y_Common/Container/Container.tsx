import * as React from "react";
import style from "./Container.module.scss"
import {FC} from "react";
import clsx from "clsx";

interface IContainer {
    className?: string
    children: React.ReactNode
}

export const Container: FC<IContainer> = ({
                                              className,
                                              children
                                          }) => {
    return (
        <section className={clsx(style.container, Boolean(className) && className)}>
            <div className={style.inner}>
                {children}
            </div>
        </section>
    )
}