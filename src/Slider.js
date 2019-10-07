import React, { useCallback } from "react";
import styles from "./Slider.module.scss";
import Typography from "@material-ui/core/Typography";
import MaterialSlider from "@material-ui/core/Slider";
import Grid from "@material-ui/core/Grid";
import Input from "@material-ui/core/Input";
import { strip, clamp } from "./util";
import InputAdornment from "@material-ui/core/InputAdornment";
import AspectRatioIcon from "@material-ui/icons/AspectRatio";

const Slider = ({
  label,
  onChange,
  data: {
    value,
    range: [min, max],
    step = 1,
    units = null,
  },
  icon,
}) => {
  const handleSliderChange = useCallback(
    (_, newValue) => {
      if (value === newValue) {
        return;
      }
      onChange(clamp(newValue, min, max));
    },
    [max, min, onChange, value],
  );

  const handleInputChange = useCallback(
    ({ target: { value: newValue } }) => {
      if (value === newValue) {
        return;
      }
      onChange(clamp(newValue, min, max));
    },
    [max, min, onChange, value],
  );

  const id = `input-${strip(label)}`;

  return (
    <div>
      <Typography id={id} gutterBottom>
        {label}
      </Typography>
      <Grid container spacing={2} alignItems="center">
        {icon && <Grid item>{icon}</Grid>}
        <Grid item xs>
          <MaterialSlider
            step={step}
            min={min}
            max={max}
            value={value}
            onChange={handleSliderChange}
            aria-labelledby={id}
          />
        </Grid>
        <Grid item>
          <Input
            className={styles.input}
            value={value}
            margin="dense"
            onChange={handleInputChange}
            // onBlur={onChange}
            inputProps={{
              step,
              min,
              max,
              type: "number",
              "aria-labelledby": id,
            }}
            endAdornment={
              units ? (
                <InputAdornment position="end">{units}</InputAdornment>
              ) : null
            }
          />
        </Grid>
      </Grid>
    </div>
  );
};

export default React.memo(Slider);
