import React, { createContext, useContext } from "react";
import useMethods from "use-methods";

const StateContext = createContext();
const CallbackContext = createContext();

export const Provider = ({ methods, initialState, children }) => {
  const [state, callbacks] = useMethods(methods, initialState);
  return (
    <StateContext.Provider value={state}>
      <CallbackContext.Provider value={callbacks}>
        {children}
      </CallbackContext.Provider>
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
export const useCallbackContext = () => useContext(CallbackContext);
