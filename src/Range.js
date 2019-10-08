import React, { useCallback } from "react";
import Input from "@material-ui/core/Input";
import InputAdornment from "@material-ui/core/InputAdornment";
import { clamp, useHighlight, inToCm } from "./util";

const Range = ({
  value,
  onChange,
  min,
  max,
  step,
  id,
  units,
  onBlur,
  origUnits,
}) => {
  const inputEl = useHighlight(value);
  const inches = units === "in" && units !== origUnits;

  const handleInputChange = useCallback(
    ({ target: { value: newValue } }) => {
      if (value === newValue) {
        return;
      }
      const clampedValue = clamp(newValue, min, max);
      onChange(inches ? inToCm(clampedValue) : clampedValue);
    },
    [max, min, inches, onChange, value],
  );

  return (
    <Input
      fullWidth
      value={value}
      margin="dense"
      onChange={handleInputChange}
      inputRef={inputEl}
      onBlur={onBlur}
      inputProps={{
        step,
        min,
        max,
        type: "number",
        "aria-labelledby": id,
        lang: "en",
      }}
      endAdornment={
        units ? <InputAdornment position="end">{units}</InputAdornment> : null
      }
    />
  );
};

export default React.memo(Range);
