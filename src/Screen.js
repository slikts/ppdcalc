import React from "react";
import styles from "./Screen.module.scss";
import { cssize } from "./util";

const Screen = ({ vars }) => {
  return <div className={styles.Screen} style={cssize(vars)}></div>;
};

export default React.memo(Screen);
