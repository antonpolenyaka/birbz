import * as React from "react";
import style from "./SocialLinks.module.scss"
import {svgIcons} from "../../../assets/svg/svgIcons";
import {FC} from "react";
import clsx from "clsx";

export const socialLinks = [
    {icon: svgIcons.twitter, href: "#"},
    {icon: svgIcons.ship, href: "#"},
];

interface ISocialLinks {
    className?: string
}

export const SocialLinks: FC<ISocialLinks> = ({ className }) => {
    return (
        <nav className={clsx(style.socialLinks, Boolean(className) && className)}>
            {
                socialLinks.map(({icon, href}, index) => (
                    <a key={index}
                       href={href}
                       className={style.link}
                       target="_blank"
                       rel="noopener nofollow"
                    >
                        {icon}
                    </a>
                ))
            }
        </nav>
    )
}