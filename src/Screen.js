import React from "react";
import classNames from "classnames";
import styles from "./Screen.module.scss";
import { cssize } from "./util";

const Screen = ({ vars, inverse }) => {
  return <div className={styles.Screen} style={cssize(vars)} />;
};

export default React.memo(Screen);
