import { produce } from "immer";
import update from "./update";
import { unserialize, serialize, clearHash, applyUnserialized } from "./util";

const persist = (state, history = window.history) => {
  const hash = serialize(state);
  if (hash && hash !== initialHash) {
    history.replaceState(undefined, undefined, `#${hash}`);
  } else {
    clearHash();
  }
};
const persistUpdate = state => {
  update(state);
  persist(state);
};

export const methods = draft => ({
  reset() {
    clearHash();
    return initialState;
  },
  setDepth(value) {
    draft.depth.value = value;
    persistUpdate(draft);
  },
  setDiagonal(value) {
    draft.diagonal.value = value;
    persistUpdate(draft);
  },
  setElevation(value) {
    draft.elevation.value = value;
    persistUpdate(draft);
  },
  setViewpoint(value) {
    draft.viewpoint.value = value;
    persistUpdate(draft);
  },
  setScreenResX(value) {
    draft.screen.resolution.x = value;
    persistUpdate(draft);
  },
  setScreenResY(value) {
    draft.screen.resolution.y = value;
    persistUpdate(draft);
  },
  setFOV(value) {
    draft.fov.value = value;
    persistUpdate(draft);
  },
  apply(state) {
    applyUnserialized(state, draft);
    persistUpdate(draft);
  },
  align() {
    const elevation =
      Math.round((draft.elevation.value + draft.screen.size.y) * 10) / 10 - 6;
    this.setViewpoint(elevation);
    persistUpdate(draft);
  },
  setUnits(units) {
    console.log(units);
    draft.units = units;
    update(draft);
  },
});

const initialState = produce(
  {
    units: "cm",
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
      units: null,
      origUnits: "cm",
    },
    diagonal: {
      value: 65,
      range: [5, 150],
      units: "in",
      origUnits: "in",
    },
    depth: {
      value: 200,
      range: [10, 1000],
      step: 10,
      units: null,
      origUnits: "cm",
    },
    viewpoint: {
      value: 150,
      range: [0, 200],
      step: 5,
      units: null,
      origUnits: "cm",
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
        [1366, 720, "HD"],
        [1920, 1080, "FHD"],
        [2560, 1440, "QHD"],
        [3840, 1440, "UWQHD"],
        [3840, 2160, "4K UHD"],
        [5120, 2160, "WUHD"],
        [5120, 2880, "5K UHD"],
        [7680, 4320, "8K FUHD"],
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
  update,
);

const initialHash = serialize(initialState);
export const persistedState = unserialize(initialState);