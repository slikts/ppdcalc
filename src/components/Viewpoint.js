import React from "react";
import classNames from "classnames";
import styles from "./Viewpoint.module.scss";
import { cssize } from "../util";
import Icon from "@material-ui/core/Icon";

const Viewpoint = ({ vars, height }) => {
  return (
    <div
      className={classNames(styles.Viewpoint, {
        [styles.inverse]: height < 0,
      })}
      style={cssize({ ...vars, height: `${Math.abs(height)}%` })}
    >
      <div className={styles.icon}>
        <Icon>visibility</Icon>
      </div>
    </div>
  );
};

export default React.memo(Viewpoint);
