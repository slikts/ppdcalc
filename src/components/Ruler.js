import React from "react";
import styles from "./Ruler.module.scss";
import { cssize } from "../util";
import ScalePerson from "./ScalePerson";
import ScaleBanana from "./ScaleBanana";

const Ruler = ({ segments }) => {
  const children = Array.from({ length: segments }, (_, i) => (
    <div
      className={styles.segment}
      key={i}
      data-n={`${Math.ceil((segments - i - 1) / 10)}m`}
    ></div>
  ));
  return (
    <div className={styles.Ruler} style={cssize({ segments })}>
      {children}
      <div className={styles.person}>
        <ScalePerson />
        <div className={styles.banana}>
          <ScaleBanana />
        </div>
      </div>
    </div>
  );
};

export default React.memo(Ruler);
