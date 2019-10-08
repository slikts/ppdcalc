import React, { useMemo, useCallback } from "react";
import { useCallbackContext } from "../providers";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import FormHelperText from "@material-ui/core/FormHelperText";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import { optionalLabel } from "../util";
import ViewComfyIcon from "@material-ui/icons/ViewComfy";
import Grid from "@material-ui/core/Grid";
import Range from "./Range";

const Resolution = ({
  state: {
    presets,
    x,
    y,
    range: [min, max],
    step,
  },
}) => {
  const callbacks = useCallbackContext();

  const handleSelectChange = useCallback(
    (_, { key }) => {
      const [x, y] = key.split("x").map(Number);
      callbacks.setScreenResX(x);
      callbacks.setScreenResY(y);
    },
    [callbacks],
  );
  const items = useMemo(
    () =>
      [...presets].map(([k, v]) => (
        <MenuItem key={k} value={k}>
          {optionalLabel(`${v.x}×${v.y}`, v.label)}
        </MenuItem>
      )),
    [presets],
  );
  const key = `${x}x${y}`;
  return (
    <FormControl component="fieldset">
      <FormLabel component="legend">Resolution</FormLabel>
      <Grid container spacing={2} alignItems="center">
        <Grid item>
          <ViewComfyIcon />
        </Grid>
        <Grid item>
          <FormControl>
            <Range
              value={x}
              onChange={callbacks.setScreenResX}
              min={min}
              max={max}
              step={step}
              units="px"
            />
            <FormHelperText>Width</FormHelperText>
          </FormControl>
        </Grid>
        <Grid item>
          <FormControl>
            <Range
              value={y}
              onChange={callbacks.setScreenResY}
              min={min}
              max={max}
              step={step}
              units="px"
            />
            <FormHelperText>Height</FormHelperText>
          </FormControl>
        </Grid>
      </Grid>
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
