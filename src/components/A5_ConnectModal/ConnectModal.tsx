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
    onClose: () => void
}

export const ConnectModal: FC<IConnectModal> = ({show, error, onClose}) => {
    const descriptionSuccess = "MetaMask enables two methods: restricted and unrestricted. These methods allow the dApp to take actions like connecting to the wallet, signing transactions, and adding or switching networks."
    const descriptionError = "When trying to connect to the wallet, if a user clicks “Cancel” at any point on this interface and terminates the process, it returns a 4001 error."

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
                    {error ? "Error" : "Connect wallet"}
                </p>

                <p className={style.description}>{error ? descriptionError : descriptionSuccess}</p>

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