import React from "react";
import ToggleButton from "@material-ui/lab/ToggleButton";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";
import { useCallbackContext, useStateContext } from "../providers";

const ToggleUnits = () => {
  const { rawUnits } = useStateContext();
  const { setRawUnits } = useCallbackContext();
  const handleChange = React.useCallback(
    (_, value) => {
      setRawUnits(value);
    },
    [setRawUnits],
  );

  return (
    <ToggleButtonGroup
      value={rawUnits}
      exclusive
      onChange={handleChange}
      aria-label="text alignment"
    >
      <ToggleButton value="cm">cm</ToggleButton>
      <ToggleButton value="in">in</ToggleButton>
    </ToggleButtonGroup>
  );
};

export default ToggleUnits;
