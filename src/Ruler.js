import React from "react";
import styles from "./Ruler.module.scss";
import { cssize } from "./util";

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
    </div>
  );
};

export default React.memo(Ruler);
