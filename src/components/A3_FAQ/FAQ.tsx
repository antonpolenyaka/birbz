import {Container} from "../Y_Common/Container/Container";
import style from "./FAQ.module.scss"
import * as React from "react";
import {Bird} from "../Y_Common/Bird/Bird";

const items = [
    {
        q: "ahhh shit...",
        a: "On Thursday, Mr. Tokyo left his office at the usual time - 6:30.",
    },
    {
        q: "who took them?!",
        a: "He always locked the Lab as he left, making sure no one could peak in on his special project.",
    },
    {
        q: "how did they get the code?!",
        a: "Fortunately for our little BIRBZ, he made one big mistake...",
    },
]


export const FAQ = () => {
    return (
        <Container className={style.faq}>

            <Bird className={style.bird}/>

            <div className={style.items}>
                {
                    items.map(({q, a}, index) => (
                        <div className={style.item} key={index}>
                            <p className={style.q}>{q}</p>
                            <p className={style.a}>{a}</p>
                        </div>
                    ))
                }
            </div>

        </Container>
    )
}