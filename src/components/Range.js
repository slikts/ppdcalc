import React, { useCallback } from "react";
import Input from "@material-ui/core/Input";
import InputAdornment from "@material-ui/core/InputAdornment";
import { useHighlight } from "../hooks";

const Range = ({
  value,
  onChange,
  onBlur,
  min,
  max,
  step,
  id,
  units,
  origUnits,
}) => {
  const inputEl = useHighlight(value);

  const handleInputChange = useCallback(
    ({ target: { value: newValue } }) => {
      if (value === newValue) {
        return;
      }
      if (newValue === "") {
        onChange("");
        return;
      }
      onChange(newValue);
    },
    [value, onChange],
  );

  const handleBlur = useCallback(
    ({ target: { value } }) => {
      onBlur(value);
    },
    [onBlur],
  );

  return (
    <Input
      fullWidth
      value={value}
      margin="dense"
      onChange={handleInputChange}
      inputRef={inputEl}
      onBlur={handleBlur}
      inputProps={{
        step,
        min,
        max,
        type: "number",
        "aria-labelledby": id,
        lang: "en",
      }}
      endAdornment={<InputAdornment position="end">{units}</InputAdornment>}
    />
  );
};

export default React.memo(Range);
