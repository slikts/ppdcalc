import React, { useCallback, useState } from "react";
import Input from "@material-ui/core/Input";
import InputAdornment from "@material-ui/core/InputAdornment";
import { clamp, in2cm } from "../util";
import { useHighlight } from "../hooks";

const Range = ({ value, onChange, min, max, step, id, units, origUnits }) => {
  const inputEl = useHighlight(value);
  const inches = units === "in" && units !== origUnits;
  const [editing, setEditing] = useState(null);

  const handleInputChange = useCallback(
    ({ target: { value: newValue } }) => {
      if (editing) {
        setEditing(null);
        return;
      }
      if (value === newValue) {
        return;
      }
      if (newValue === "") {
        onChange("");
        return;
      }
      onChange(newValue);
    },
    [editing, value, onChange],
  );

  const handleBlur = () => {
    const clampedValue = clamp(value, min, max);
    const newValue = inches ? in2cm(clampedValue) : clampedValue;
    if (newValue === value) {
      return;
    }
    onChange(newValue);
  };

  return (
    <Input
      fullWidth
      value={editing || value}
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
      endAdornment={
        units ? <InputAdornment position="end">{units}</InputAdornment> : null
      }
    />
  );
};

export default React.memo(Range);
