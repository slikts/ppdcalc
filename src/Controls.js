import React from "react";
// import styles from "./Controls.module.scss";
import Slider from "./Slider";
import { useStateContext, useCallbackContext } from "./state";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Icon from "@material-ui/core/Icon";
import VerticalAlignTopIcon from "@material-ui/icons/VerticalAlignTop";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import Resolution from "./Resolution";
import AspectRatioIcon from "@material-ui/icons/AspectRatio";
import HeightIcon from "@material-ui/icons/Height";
import VisibilityIcon from "@material-ui/icons/Visibility";
import SettingsOverscanIcon from "@material-ui/icons/SettingsOverscan";
import ZoomInIcon from "@material-ui/icons/ZoomIn";

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
        icon={<ZoomInIcon />}
      />
      <Slider
        label="Viewpoint height"
        data={state.viewpoint}
        onChange={callbacks.setViewpoint}
        icon={<VisibilityIcon />}
      />
      <FormControl component="fieldset">
        <FormLabel component="legend">Screen</FormLabel>
        <FormControl>
          <Slider
            label="Screen elevation"
            onChange={callbacks.setElevation}
            data={state.elevation}
            icon={<HeightIcon />}
          />
        </FormControl>
        <FormControl>
          <Slider
            label="Screen diagonal"
            data={state.diagonal}
            onChange={callbacks.setDiagonal}
            icon={<AspectRatioIcon />}
          />
        </FormControl>
        <FormControl>
          <Slider
            label="Field of view"
            data={state.fov}
            onChange={callbacks.setFOV}
            icon={<SettingsOverscanIcon />}
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
          <Button
            variant="outlined"
            startIcon={<VerticalAlignTopIcon />}
            onClick={callbacks.align}
          >
            Align
          </Button>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Controls;
