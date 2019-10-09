import { produce } from "immer";

export const strip = s => btoa(s).replace(/=/g, "");

export const clamp = (n, min, max) => Math.min(Math.max(n, min), max);

const inCmRatio = 2.54;
export const in2cm = n => n * inCmRatio;
export const cm2in = n => n / inCmRatio;
const converters = { in2cm, cm2in };
export const Converter = (from, to) => converters[`${from}2${to}`];

export const optionalLabel = (a, b) => `${a}${b ? ` (${b})` : ""}`;

export const mapObject = (o, f) => Object.fromEntries(Object.entries(o).map(f));
export const mapObjectValues = (o, f) => mapObject(o, ([k, v]) => [k, f(v)]);

export const cssize = o => mapObject(o, ([k, v]) => [`--${k}`, v]);

export const degreeize = n => `${n}°`;
export const percentize = n => `${n}%`;
export const pixelize = n => `${n}px`;

export const getPersistent = state => {
  const { x, y } = state.resolution;
  return Object.entries(state.sliders).concat(Object.entries({ x, y }));
};
export const serialize = state => {
  return getPersistent(state)
    .map(kv => kv.join(":"))
    .join(",");
};

export const unserialize = (baseState, hash = window.location.hash) => {
  const state = Object.fromEntries(
    hash
      .slice(1)
      .split(",")
      .filter(Boolean)
      .map(x => x.split(":").map(s => s.trim())),
  );

  return produce(baseState, draft => {
    //TODO:
    // applyUnserialized(state, draft);
  });
};

export const dToR = d => d * (Math.PI / 180);

export const clearHash = (
  history = window.history,
  location = window.location,
) => {
  history.pushState("", document.title, location.pathname + location.search);
};

export const getPPD = (x, y, diagonal, distance) =>
  x /
  2 /
  ((180 / Math.PI) *
    Math.atan(
      ((diagonal / Math.sqrt(x ** 2 + y ** 2)) * (x / 2)) / cm2in(distance),
    ));
