import React from "react";
import ToggleButton from "@material-ui/lab/ToggleButton";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";
import { useCallbackContext, useStateContext } from "../providers";

const ToggleUnits = () => {
  const { units } = useStateContext();
  const { setUnits } = useCallbackContext();
  const handleChange = React.useCallback(
    (_, value) => {
      setUnits(value);
    },
    [setUnits],
  );

  return (
    <ToggleButtonGroup
      value={units}
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
