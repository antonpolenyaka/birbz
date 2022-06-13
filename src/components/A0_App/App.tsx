import React from 'react';
import style from "./App.module.scss"
import Birbz from "../A1_Birbz/Birbz";
import Mint from "../A2_Mint/Mint";
import {FAQ} from "../A3_FAQ/FAQ";
import {Studio} from "../A4_Studio/Studio";

export const App = () => {
  return (
    <div className={style.app}>
        <Birbz/>
        <Mint/>
        <FAQ/>
        <Studio/>
    </div>
  );
}

