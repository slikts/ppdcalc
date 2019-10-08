import React from "react";
import styles from "./Scene.module.scss";
import Screen from "./Screen";
import { useStateContext } from "./providers";
import { cssize } from "./util";
import Ruler from "./Ruler";
import DataTable from "./DataTable";
import Viewpoint from "./Viewpoint";

const Scene = () => {
  const { maxAbsSize, scene, screen, rowData, viewpoint } = useStateContext();
  const segments = Math.ceil(maxAbsSize / 2 / 100) * 10 + 1;
  return (
    <React.Fragment>
      <div className={styles.Scene} style={cssize(scene.vars)}>
        <div className={styles.container}>
          <div className={styles.subcontainer}>
            <div className={styles.ground}></div>
            <Screen vars={screen.vars} />
            <Ruler segments={segments} />
            <Viewpoint vars={viewpoint.vars} height={viewpoint.height} />
          </div>
        </div>
        <DataTable data={rowData} />
      </div>
    </React.Fragment>
  );
};

export default Scene;
