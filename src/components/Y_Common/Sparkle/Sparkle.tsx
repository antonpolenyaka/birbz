import * as React from "react";
import style from "./Sparkle.module.scss";
import sparkle from "../../../assets/png/sparkle.png";
import {FC} from "react";
import clsx from "clsx";
import "./sparkleAnimation.scss"

interface ISparkle {
    className?: string
    animationDelay?: number
}

export const Sparkle: FC<ISparkle> = ({
                                          className,
                                          animationDelay = 0
}) => {
    return (
        <div className={clsx(style.sparkle, Boolean(className) && className)}>
            <img className="anim"
                 style={{animationDelay: `${animationDelay}s`}}
                 src={sparkle}
                 alt=""
            />
        </div>
    )
}