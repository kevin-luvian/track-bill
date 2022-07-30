import React from "react";
import Curves, { AdjCurves } from "../graphs/Curves";
import styles from "./styles.module.scss";

const GrCard = ({ ...props }) => {
  return (
    <div className="card">
      <div className={`position-absolute ${styles.cardInfo}`}>
        <p className="m-0 text-center">Balance:</p>
        <p className="m-0 text-center">Rp. 300.000,00</p>
      </div>
      <AdjCurves
        style={{ height: "170px" }}
        padding={{ t: 20, b: 40, l: 0, r: 0 }}
      />
    </div>
  );
};

export default GrCard;
