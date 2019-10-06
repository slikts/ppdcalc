import React, { useMemo, useCallback } from "react";
import { useCallbackContext } from "./state";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import Input from "@material-ui/core/Input";
import InputAdornment from "@material-ui/core/InputAdornment";
import FormHelperText from "@material-ui/core/FormHelperText";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import { optionalLabel } from "./util";

const inputProps = {
  min: 768,
  max: 7680,
  step: 8,
  type: "number"
};
const Resolution = ({ presets, x, y }) => {
  const callbacks = useCallbackContext();
  const handleInputChangeX = useCallback(
    ({ target: { value } }) => {
      callbacks.setScreenResX(value);
    },
    [callbacks]
  );
  const handleInputChangeY = useCallback(
    ({ target: { value } }) => {
      callbacks.setScreenResY(value);
    },
    [callbacks]
  );
  const handleSelectChange = useCallback(
    (_, { key }) => {
      const [x, y] = key.split("x").map(Number);
      callbacks.setScreenResX(x);
      callbacks.setScreenResY(y);
    },
    [callbacks]
  );
  const items = useMemo(
    () =>
      [...presets].map(([k, v]) => (
        <MenuItem key={k} value={k}>
          {optionalLabel(k, v.label)}
        </MenuItem>
      )),
    [presets]
  );
  const key = `${x}x${y}`;
  return (
    <FormControl component="fieldset">
      <FormLabel component="legend">Resolution</FormLabel>
      <div>
        <FormControl>
          <Input
            value={x}
            inputProps={inputProps}
            endAdornment={<InputAdornment position="end">px</InputAdornment>}
            onChange={handleInputChangeX}
          />
          <FormHelperText>Width</FormHelperText>
        </FormControl>
        <FormControl>
          <Input
            value={y}
            inputProps={inputProps}
            endAdornment={<InputAdornment position="end">px</InputAdornment>}
            onChange={handleInputChangeY}
          />
          <FormHelperText>Height</FormHelperText>
        </FormControl>
      </div>
      <FormControl>
        <InputLabel htmlFor="age-simple">Preset</InputLabel>
        <Select
          value={presets.has(key) ? key : null}
          onChange={handleSelectChange}
        >
          {items}
        </Select>
      </FormControl>
    </FormControl>
  );
};

export default React.memo(Resolution);
