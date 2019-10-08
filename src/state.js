import { produce } from "immer";
import update from "./update";
import {
  unserialize,
  serialize,
  clearHash,
  applyUnserialized,
  clamp,
  Converter,
  cm2in,
  in2cm,
} from "./util";

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

const cleanValue = (value, [min, max]) =>
  clamp(Math.round(value * 10) / 10, min, max);

const baseUnits = "cm";

export const methods = draft => ({
  reset() {
    return initialState;
  },
  setSliderValue(key, value) {
    const slider = draft.sliders[key];
    const { raw } = slider;
    slider.value = value;
    const convert = Converter(slider.units, draft.rawUnits);
    const rawValue = convert ? convert(value) : value;
    raw.value = rawValue;
    raw.cleanedValue = rawValue;
    raw.defaultValue = rawValue;
  },
  resetSlider(key) {
    this.setSliderValue(key, draft.sliders[key].defaultValue);
  },
  setRawSliderValue(key, rawValue) {
    const slider = draft.sliders[key];
    const { raw } = slider;
    raw.value = rawValue;
    const cleanedValue = cleanValue(rawValue, raw.range);
    const isConvertible = slider.units === baseUnits && draft.rawUnits === "in";
    if (isNaN(cleanedValue)) {
      raw.cleanedValue = isConvertible ? cm2in(slider.default) : slider.default;
      slider.value = slider.default;
    } else {
      raw.cleanedValue = cleanedValue;
      slider.value = isConvertible ? in2cm(cleanedValue) : cleanedValue;
    }
  },
  setRawResolution(key, rawValue) {
    const { resolution } = draft;
    const [min, max] = resolution.range;
    const value = clamp(Math.round(rawValue), min, max);
    resolution[key] = isNaN(value) ? resolution.default[key] : value;
    resolution.raw[key] = rawValue;
  },
  apply(state) {
    // TODO:
    applyUnserialized(state, draft);
  },
  align() {
    const elevation =
      Math.round((draft.elevation.value + draft.screen.size.y) * 10) / 10 - 6;
    this.setSliderValue("elevation", elevation);
  },
  setRawUnits(units) {
    const convert = Converter(units, draft);
    if (!convert) {
      return;
    }
    Object.values(draft.sliders).forEach(slider => {
      if (slider.units !== baseUnits) {
        return;
      }
      const rawValue = convert(slider.value);
      const rawRange = slider.range.map(convert);
      const { raw } = slider;
      raw.value = rawValue;
      raw.range = rawRange;
      raw.default = convert(slider.default);
      raw.cleanedValue = cleanValue(rawValue, rawRange);
      raw.step = convert(slider.step);
    });
    draft.rawUnits = units;
  },
  update,
  patchCallback(patches, inversePatches) {
    console.log(...patches);
    console.log(...inversePatches);
  },
});

const Slider = ({ defaultValue, range, step, units, ...rest }) => ({
  value: defaultValue,
  defaultValue,
  range,
  step,
  units,
  raw: {
    value: defaultValue,
    defaultValue,
    range,
    cleanedValue: defaultValue,
    step,
  },
  ...rest,
});

const Resolution = ({ x, y }) => ({
  x,
  y,
  raw: {
    x,
    y,
  },
  default: {
    x: 3840,
    y: 2160,
  },
});

const initialState = produce(
  {
    rawUnits: "cm",
    // absSize: NaN,
    // maxAbsSize: NaN,
    // ratio: NaN,
    sliders: {
      fov: Slider({
        defaultValue: 140,
        range: [45, 160],
        step: 1,
        units: "°",
      }),
      elevation: Slider({
        defaultValue: 75,
        range: [0, 200],
        step: 5,
        units: "cm",
      }),
      diagonal: Slider({
        defaultValue: 65,
        range: [5, 150],
        units: "in",
      }),
      depth: Slider({
        defaultValue: 200,
        range: [10, 1000],
        step: 10,
        units: "cm",
      }),
      viewpoint: Slider({
        defaultValue: 150,
        range: [0, 200],
        step: 5,
        units: "cm",
        vars: {
          top: null,
        },
        height: null,
      }),
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
    resolution: {
      ...Resolution({
        x: 3840,
        y: 2160,
      }),
      range: [768, 7680],
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
    },
    screen: {
      size: {
        width: null,
        height: null,
      },
      vars: {
        width: null,
        height: null,
        elevation: null,
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
