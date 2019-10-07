import { produce } from "immer";
import update, { dataKeys } from "./update";

export const strip = s => btoa(s).replace(/=/g, "");

export const clamp = (n, min, max) => Math.min(Math.max(n, min), max);

const inCmRatio = 2.54;
export const inToCm = n => n * inCmRatio;
export const cmToIn = n => n / inCmRatio;

export const optionalLabel = (a, b) => `${a}${b ? ` (${b})` : ""}`;

export const mapObject = (o, f) => Object.fromEntries(Object.entries(o).map(f));
export const mapObjectValues = (o, f) => mapObject(o, ([k, v]) => [k, f(v)]);

export const cssize = o => mapObject(o, ([k, v]) => [`--${k}`, v]);

export const degreeize = n => `${n}°`;
export const percentize = n => `${n}%`;
export const pixelize = n => `${n}px`;

export const getPersistent = state => {
  const { x, y } = state.screen.resolution;
  return dataKeys
    .map(k => [k, state[k].value])
    .concat(Object.entries({ x, y }));
};
export const serialize = state => {
  return getPersistent(state)
    .map(kv => kv.join(":"))
    .join(",");
};

export const applyUnserialized = (state, draft) => {
  dataKeys.forEach(k => {
    if (!state[k]) {
      return;
    }
    draft[k].value = Number(state[k]);
  });
  const { x, y } = state;
  if (x) {
    draft.screen.resolution.x = x;
  }
  if (y) {
    draft.screen.resolution.y = y;
  }
  update(draft);
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
    applyUnserialized(state, draft);
  });
};

export const dToR = d => d * (Math.PI / 180);

export const clearHash = (
  history = window.history,
  location = window.location,
) => {
  history.pushState("", document.title, location.pathname + location.search);
};
