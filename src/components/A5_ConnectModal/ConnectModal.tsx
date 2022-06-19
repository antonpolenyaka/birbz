import {FC, useRef} from "react";
import style from "./ConnectModal.module.scss"
import * as React from "react";
import clsx from "clsx";
import imgSuccess from "../../assets/png/connect modal/success.png";
import imgError from "../../assets/png/connect modal/error.png";
import {useOutsideClick} from "../../hooks/useOutsideClick";
import {svgIcons} from "../../assets/svg/svgIcons";
import {Bird} from "../Y_Common/Bird/Bird";

interface IConnectModal {
    show: boolean
    error: boolean
	description: string,
    onClose: () => void
}

export const ConnectModal: FC<IConnectModal> = ({show, error, description, onClose}) => {

    const ref = useRef<HTMLDivElement>(null)
    const onClickHandler = () => onClose();
    useOutsideClick(ref, () => onClose())

    return (
        <div className={clsx({
            [style.connectModal]: true,
            [style.connectModal_show]: show,
        })}>
             <div className={clsx({
                 [style.card]: true,
                 [style.card_error]: error,
             })}
                  ref={ref}
             >

                 <Bird className={style.bird}/>

                 <button className={style.closeBtn}
                         onClick={() => onClose()}
                 >
                     {svgIcons.close}
                 </button>

                <p className={style.title}>
                    {error ? "Error" : "Information"}
                </p>

                <p className={style.description}>{description}</p>

                 <img src={error ? imgError : imgSuccess} alt="" className={style.figure}/>

                 <button className={style.btn}
                         onClick={onClickHandler}
                 >
                     OK
                 </button>
             </div>
        </div>
    )
}