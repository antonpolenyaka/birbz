import * as React from "react";
import {Container} from "../Y_Common/Container/Container";
import style from "./Studio.module.scss"
import {Bird} from "../Y_Common/Bird/Bird";
import egg from "../../assets/png/mint.png";
import {SocialLinks} from "../Y_Common/SocialLinks/SocialLinks";

export const Studio = () => {
    return (
        <Container className={style.studio}>

             <div className={style.titleBlock}>
                <h2 className={style.title}>birbz studio</h2>
                 <Bird className={style.bird}/>
             </div>

            <div className={style.eggBlock}>
                <img src={egg} alt=""/>
                <p>KAWK, CHIRP, SQUEAK</p>

            </div>

            <div className={style.socialLinks}>
                <SocialLinks/>
            </div>

        </Container>
    )
}