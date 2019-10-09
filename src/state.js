import { produce } from "immer";
import updateScene from "./updateScene";
import { unserialize, clamp, Converter, cm2in, in2cm } from "./util";

// const persist = (state, history = window.history) => {
//   const hash = serialize(state);
//   if (hash && hash !== initialHash) {
//     history.replaceState(undefined, undefined, `#${hash}`);
//   } else {
//     clearHash();
//   }
// };
// TODO:
// const persistUpdate = state => {
//   updateScene(state);
//   persist(state);
// };

const cleanValue = (value, [min, max]) =>
  clamp(Math.round(value * 10) / 10, min, max);

const baseUnits = "cm";

export const methods = {
  methods: draft => ({
    reset() {
      return draft.rawUnits === "in" ? initialStateIn : initialState;
    },
    setSliderValue(key, value) {
      const slider = draft.sliders[key];
      const { raw } = slider;
      slider.value = value;
      const rawValue =
        slider.units === "cm" && draft.rawUnits === "in"
          ? Math.round(cm2in(value) * 10) / 10
          : value;
      raw.value = rawValue;
      raw.cleanedValue = rawValue;
      raw.defaultValue = rawValue;
      this.updateScene();
    },
    resetSlider(key) {
      this.setSliderValue(key, draft.sliders[key].defaultValue);
    },
    setRawSliderValue(key, rawValue) {
      const slider = draft.sliders[key];
      const { raw } = slider;
      raw.value = rawValue === "" ? rawValue : Number(rawValue);
      const cleanedValue = cleanValue(rawValue, raw.range);
      const isConvertible =
        slider.units === baseUnits && draft.rawUnits === "in";
      if (isNaN(cleanedValue)) {
        raw.cleanedValue = isConvertible
          ? cm2in(slider.default)
          : slider.default;
        slider.value = slider.default;
      } else {
        raw.cleanedValue = cleanedValue;
        slider.value = isConvertible ? in2cm(cleanedValue) : cleanedValue;
      }
      this.updateScene();
    },
    setResolution(x, y) {
      this.setRawResolution("x", x);
      this.setRawResolution("y", y);
      this.updateScene();
    },
    setRawResolution(key, rawValue) {
      const { resolution } = draft;
      const [min, max] = resolution.range;
      const value = rawValue === "" ? rawValue : Number(rawValue);
      const cleanedValue = clamp(Math.round(rawValue), min, max);
      resolution[key] = isNaN(cleanedValue)
        ? resolution.default[key]
        : cleanedValue;
      resolution.raw[key] = rawValue;
      resolution.cleaned[key] = cleanedValue;
      this.updateScene();
    },
    apply(newState) {
      const { sliders, resolution } = draft;
      Object.keys(sliders).forEach(key => {
        const value = newState[key];
        if (!newState[key]) {
          return;
        }
        this.setSliderValue(key, value);
      });
      const { x, y } = newState;
      if (x) {
        resolution.x = x;
      }
      if (y) {
        resolution.y = y;
      }
      this.updateScene();
    },
    align() {
      this.setSliderValue("viewpoint", draft.aligned);
    },
    setRawUnits(units) {
      const convert = Converter(draft.rawUnits, units);
      draft.rawUnits = units;
      Object.entries(draft.sliders).forEach(([key, slider]) => {
        if (slider.units !== baseUnits) {
          return;
        }
        this.setSliderValue(key, slider.value);
        const { raw } = slider;
        const rawRange = raw.range.map(convert);
        raw.units = units;
        raw.range = rawRange;
        raw.default = convert(slider.default);
        raw.cleanedValue = cleanValue(raw.value, rawRange);
        raw.step = Math.floor(convert(raw.step) * 10) / 10;
      });
    },
    updateScene() {
      updateScene(draft);
      draft.initial = draft === initialState;
    },
  }),
  // patchListener: (patches, inversePatches) => {},
};

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
    units,
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
  cleaned: {
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
      step: 8,
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
    initial: true,
    aligned: null,
  },
  updateScene,
);

// const initialHash = serialize(initialState);
const initialStateIn = produce(initialState, draft => {
  methods.methods(draft).setRawUnits("in");
});
export const persistedState = unserialize(initialState);
