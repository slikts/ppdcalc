import React from "react";
import { ThemeProvider } from "@material-ui/styles";
import CssBaseline from "@material-ui/core/CssBaseline";

import {
  createMuiTheme,
  //, makeStyles
} from "@material-ui/core/styles";

import styles from "./App.module.scss";
import Scene from "./Scene";
import Controls from "./Controls";
import { Provider } from "./state";
import { produce } from "immer";
import update from "./update";
import { unserialize, serialize, removeHash } from "./util";

// export const useStyles = makeStyles(theme => ({}));

const theme = createMuiTheme({
  palette: {
    type: "dark",
  },
});

const persist = (state, location = window.location) => {
  location.hash = serialize(state);
};
const persistUpdate = state => {
  update(state);
  persist(state);
};

const methods = state => ({
  reset() {
    removeHash();
    return initialState;
  },
  setDepth(value) {
    state.depth.value = value;
    persistUpdate(state);
  },
  setDiagonal(value, persist = true) {
    state.diagonal.value = value;
    if (persist) {
      persistUpdate(state);
    } else {
      update(state);
    }
  },
  setElevation(value) {
    state.elevation.value = value;
    persistUpdate(state);
  },
  setViewpoint(value) {
    state.viewpoint.value = value;
    persistUpdate(state);
  },
  setScreenResX(value) {
    state.screen.resolution.x = value;
    persistUpdate(state);
  },
  setScreenResY(value) {
    state.screen.resolution.y = value;
    persistUpdate(state);
  },
  setFOV(value) {
    state.fov.value = value;
    persistUpdate(state);
  },
});

const initialState = produce(
  {
    absSize: NaN,
    maxAbsSize: NaN,
    ratio: NaN,
    fov: {
      value: 140,
      range: [45, 160],
      step: 1,
      units: "°",
    },
    relative: {
      elevation: NaN,
      diagonal: NaN,
      depth: NaN,
      viewpoint: NaN,
    },
    elevation: {
      value: 75,
      range: [0, 200],
      step: 5,
      units: "cm",
    },
    diagonal: {
      value: 65,
      range: [5, 100],
      units: "in",
    },
    depth: {
      value: 200,
      range: [10, 1000],
      step: 10,
      units: "cm",
    },
    viewpoint: {
      value: 150,
      range: [0, 200],
      step: 10,
      units: "cm",
      vars: {
        top: null,
      },
    },
    scene: {
      absSize: NaN,
      vars: {
        zoom: NaN,
        aspectRatio: 4 / 3,
        // aspectRatio: 16 / 10,
        // aspectRatio: 1,
        tileSize: NaN,
      },
    },
    screen: {
      resolution: {
        x: 3840,
        y: 2160,
      },
      presets: [
        [1280, 720, "HD"],
        [1920, 1080, "FHD"],
        [1920, 1200],
        [2560, 1440, "QHD"],
        [3840, 1440],
        [3840, 2160, "4K UHD"],
        [7680, 4320, "8K UHD"],
      ].reduce(
        (m, [x, y, label = null]) => m.set(`${x}x${y}`, { x, y, label }),
        new Map(),
      ),
      size: {
        x: null,
        y: null,
      },
      vars: {
        width: null,
        height: null,
      },
      viewpointMeasureHeight: null,
      viewpointMeasureInverse: null,
    },
    rowData: {
      degree: {
        name: "Viewing angle",
        value: null,
      },
      ppi: {
        name: "PPI",
        value: null,
      },
      ppd: {
        name: "PPD",
        value: null,
      },
    },
  },
  draft => {
    const init = methods(draft);
    init.setDiagonal(draft.diagonal.value, false);
  },
);

const persistedState = unserialize(initialState, update);

const App = () => (
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <Provider initialState={persistedState} methods={methods}>
      <div className={styles.App}>
        <main className={styles.main}>
          <Scene />
        </main>
        <div>
          <Controls />
        </div>
      </div>
    </Provider>
  </ThemeProvider>
);

export default App;
