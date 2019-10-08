import React, { useCallback } from "react";
// import styles from "./Slider.module.scss";
import Typography from "@material-ui/core/Typography";
import MaterialSlider from "@material-ui/core/Slider";
import Grid from "@material-ui/core/Grid";
import { strip, clamp, cm2in, in2cm } from "../util";
import FormLabel from "@material-ui/core/FormLabel";
import Range from "./Range";

const round = n => Math.round(cm2in(n) * 10) / 10;
const Slider = ({
  label,
  onChange,
  data: {
    rawValue,
    value: origValue,
    range: [min, max],
    step = 1,
    units,
    origUnits,
  },
  icon,
}) => {
  const id = `input-${strip(label)}`;
  const isConverted = units === "in" && units !== origUnits;
  const value = rawValue || isConverted ? round(origValue) : origValue;

  const handleSliderChange = useCallback(
    (_, newValue) => {
      if (value === newValue) {
        return;
      }
      onChange(newValue);
    },
    [onChange, value],
  );

  const unitStep = isConverted ? round(step) : step;
  const unitMin = isConverted ? round(min) : min;
  const unitMax = isConverted ? round(max) : max;

  return (
    <div>
      <FormLabel component="legend">
        <Typography gutterBottom>{label}</Typography>
      </FormLabel>
      <Grid container spacing={2} alignItems="center">
        {icon && <Grid item>{icon}</Grid>}
        <Grid item xs>
          <MaterialSlider
            step={unitStep}
            min={unitMin}
            max={unitMax}
            value={value === "" ? unitMin : value}
            onChange={handleSliderChange}
            aria-labelledby={id}
          />
        </Grid>
        <Grid item xs={4}>
          <Range
            value={value}
            onChange={onChange}
            min={unitMin}
            max={unitMax}
            step={unitStep}
            id={id}
            units={units}
            origUnits={origUnits}
          />
        </Grid>
      </Grid>
    </div>
  );
};

export default React.memo(Slider);
