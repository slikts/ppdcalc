import React, { useCallback } from "react";
// import styles from "./Slider.module.scss";
import Typography from "@material-ui/core/Typography";
import MaterialSlider from "@material-ui/core/Slider";
import Grid from "@material-ui/core/Grid";
import { strip } from "../util";
import FormLabel from "@material-ui/core/FormLabel";
import Range from "./Range";
import { useCallbackContext } from "../providers";

const Slider = ({
  label,
  dataKey,
  data: {
    raw: {
      value,
      range: [min, max],
      step,
      units,
      cleanedValue,
    },
  },
  icon,
}) => {
  const id = `input-${strip(label)}`;

  const { setRawSliderValue } = useCallbackContext();

  const handleSliderChange = useCallback(
    (_, newValue) => {
      if (value === newValue) {
        return;
      }
      setRawSliderValue(dataKey, newValue);
    },
    [dataKey, setRawSliderValue, value],
  );

  const handleInputChange = useCallback(
    value => {
      setRawSliderValue(dataKey, value);
    },
    [dataKey, setRawSliderValue],
  );

  const handleInputBlur = useCallback(
    newValue => {
      setRawSliderValue(dataKey, newValue === "" ? cleanedValue : newValue);
    },
    [cleanedValue, dataKey, setRawSliderValue],
  );

  return (
    <div>
      <FormLabel component="legend">
        <Typography gutterBottom>{label}</Typography>
      </FormLabel>
      <Grid container spacing={2} alignItems="center">
        {icon && <Grid item>{icon}</Grid>}
        <Grid item xs>
          <MaterialSlider
            step={step}
            min={min}
            max={max}
            value={value === "" ? min : value}
            onChange={handleSliderChange}
            aria-labelledby={id}
          />
        </Grid>
        <Grid item xs={4}>
          <Range
            value={value}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            min={min}
            max={max}
            step={step}
            id={id}
            units={units}
          />
        </Grid>
      </Grid>
    </div>
  );
};

export default React.memo(Slider);
