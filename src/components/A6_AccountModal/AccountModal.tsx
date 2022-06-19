import * as React from "react";
import style from "./AccountModal.module.scss"
import {FC, useRef, useState} from "react";
import clsx from "clsx";
import wallet from "../../assets/png/account modal/wallet.png";
import {svgIcons} from "../../assets/svg/svgIcons";
import {useOutsideClick} from "../../hooks/useOutsideClick";

interface IAccountModal {
    show: boolean
    walletAddress: string,
    onClose: () => void,
    onDisconnect: () => void
}

export const AccountModal: FC<IAccountModal> = ({show, walletAddress, onClose, onDisconnect}) => {
    const ref = useRef<HTMLDivElement>(null)
    const onDisconnectHandler = () => { 
        onDisconnect();
        onClose();
    }
    useOutsideClick(ref, () => onClose());

    const address = walletAddress;

    const [startShowCopied, setStartShowCopied] = useState(false);
    const onCopyHandler = () => {
        navigator.clipboard.writeText(address);
        setStartShowCopied(true);
        setTimeout(() => setStartShowCopied(false), 2000);
    }

    return (
        <div className={clsx({
            [style.accountModal]: true,
            [style.accountModal_show]: show,
        })}
             ref={ref}
        >
            <div className={style.infoWrapper}>
                <img src={wallet} alt="" className={style.imgWallet}/>
                <div className={style.info}>
                    <p className={style.label}>Account</p>
                    <p className={style.address}>{address}</p>
                    <div className={style.copyWrapper}>
                        <p className={style.label}>{startShowCopied ? "copied!": "wallet"}</p>
                        <button className={style.copyBtn}
                                onClick={onCopyHandler}
                        >
                            {svgIcons.wallet}
                        </button>
                    </div>
                </div>
            </div>

            <button className={style.btnDisconnect}
                    onClick={onDisconnectHandler}
            >
                Disconnect
            </button>
        </div>
    )
}