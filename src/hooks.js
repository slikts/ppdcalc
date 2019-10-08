import { useEffect, useRef } from "react";
import styles from "./hooks.module.scss";

export const useHighlight = value => {
  const inputEl = useRef(null);
  useEffect(() => {
    if (!inputEl.current) {
      return;
    }
    const classList = inputEl.current.classList;
    if (classList.contains(styles.input)) {
      classList.add(styles.highlight);
      const timeout = setTimeout(() => {
        classList.remove(styles.highlight);
      }, 300);

      return () => clearTimeout(timeout);
    } else {
      classList.add(styles.input);
    }
  }, [inputEl, value]);
  return inputEl;
};
