import * as React from "react";
import style from "./Bird.module.scss";
import {svgIcons} from "../../../assets/svg/svgIcons";
import clsx from "clsx";
import "./animation.scss";
import {FC} from "react";

interface IBird {
    className?: string
}

export const Bird: FC<IBird> = ({className}) => {
    return (
        <div className={clsx(style.bird, Boolean(className) && className, "fly")}>
                {svgIcons.bird_up}
                {svgIcons.bird_down}
        </div>
    )
}