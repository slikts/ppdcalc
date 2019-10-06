import React from "react";
// import styles from "./Controls.module.scss";
import Slider from "./Slider";
import { useStateContext, useCallbackContext } from "./state";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Icon from "@material-ui/core/Icon";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import Resolution from "./Resolution";

const Controls = () => {
  const state = useStateContext();
  const callbacks = useCallbackContext();
  return (
    <Grid
      container
      direction="column"
      justify="flex-start"
      alignItems="stretch"
    >
      <Slider
        label="Viewing distance"
        data={state.depth}
        onChange={callbacks.setDepth}
      />
      <Slider
        label="Viewpoint height"
        data={state.viewpoint}
        onChange={callbacks.setViewpoint}
      />
      <FormControl component="fieldset">
        <FormLabel component="legend">Screen</FormLabel>
        <FormControl>
          <Slider
            label="Screen elevation"
            onChange={callbacks.setElevation}
            data={state.elevation}
          />
        </FormControl>
        <FormControl>
          <Slider
            label="Screen diagonal"
            data={state.diagonal}
            onChange={callbacks.setDiagonal}
          />
        </FormControl>
        <FormControl>
          <Slider
            label="Field of view"
            data={state.fov}
            onChange={callbacks.setFOV}
          />
        </FormControl>
      </FormControl>
      <Resolution presets={state.screen.presets} {...state.screen.resolution} />
      <Grid container spacing={2} alignItems="center">
        <Grid item>
          <Button
            variant="outlined"
            startIcon={<Icon>refresh</Icon>}
            onClick={callbacks.reset}
          >
            Reset
          </Button>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Controls;
