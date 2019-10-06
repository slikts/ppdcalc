import React, { useCallback } from "react";
import styles from "./Slider.module.scss";
import Typography from "@material-ui/core/Typography";
import MaterialSlider from "@material-ui/core/Slider";
import Grid from "@material-ui/core/Grid";
import Input from "@material-ui/core/Input";
import { strip, clamp } from "./util";
import InputAdornment from "@material-ui/core/InputAdornment";

const Slider = ({
  label,
  onChange,
  data: {
    value,
    range: [min, max],
    step = 1,
    units = null
  }
}) => {
  // const handleSliderChange = (event, newValue) => {
  //   setValue(newValue);
  // };

  // const handleInputChange = event => {
  //   setValue(event.target.value === "" ? "" : Number(event.target.value));
  // };

  // const handleBlur = () => {
  //   if (value < 0) {
  //     setValue(0);
  //   } else if (value > 100) {
  //     setValue(100);
  //   }
  // };

  const handleSliderChange = useCallback(
    (_, value) => {
      onChange(clamp(value, min, max));
    },
    [max, min, onChange]
  );

  const handleInputChange = useCallback(
    ({ target: { value } }) => {
      onChange(clamp(value, min, max));
    },
    [max, min, onChange]
  );

  const id = `input-${strip(label)}`;

  return (
    <div>
      <Typography id={id} gutterBottom>
        {label}
      </Typography>
      <Grid container spacing={2} alignItems="center">
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
              "aria-labelledby": id
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
