import { produce } from "immer";
import { dataKeys } from "./update";

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

export const serialize = state =>
  dataKeys
    .map(k => [k, state[k].value])
    .map(kv => kv.join(":"))
    .join(",");

export const unserialize = (baseState, update, hash = window.location.hash) => {
  const data = hash
    .slice(1)
    .split(",")
    .filter(Boolean)
    .map(x => x.split(":").map(s => s.trim()));

  return produce(baseState, draft => {
    data.forEach(([k, v]) => {
      if (!v || !dataKeys.includes(k)) {
        return;
      }
      draft[k].value = Number(v);
    });
    update(draft);
  });
};

export const dToR = d => d * (Math.PI / 180);

export const removeHash = () => {
  window.history.pushState(
    "",
    document.title,
    window.location.pathname + window.location.search,
  );
};
