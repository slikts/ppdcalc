import React from "react";
// import styles from "./Controls.module.scss";
import Slider from "./Slider";
import { useStateContext, useCallbackContext } from "./providers";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Icon from "@material-ui/core/Icon";
import VerticalAlignTopIcon from "@material-ui/icons/VerticalAlignTop";
import Resolution from "./Resolution";
import AspectRatioIcon from "@material-ui/icons/AspectRatio";
import HeightIcon from "@material-ui/icons/Height";
import VisibilityIcon from "@material-ui/icons/Visibility";
import SettingsOverscanIcon from "@material-ui/icons/SettingsOverscan";
import ZoomInIcon from "@material-ui/icons/ZoomIn";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import Divider from "@material-ui/core/Divider";
import Box from "@material-ui/core/Box";
import Tooltip from "@material-ui/core/Tooltip";

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
      <Box p={2}>
        <Grid
          container
          direction="column"
          justify="flex-start"
          alignItems="stretch"
          spacing={1}
        >
          <Grid item>
            <Slider
              label="Viewing distance"
              data={state.depth}
              onChange={callbacks.setDepth}
              icon={<ZoomInIcon />}
            />
          </Grid>
          <Grid item>
            <Slider
              label="Viewpoint height"
              data={state.viewpoint}
              onChange={callbacks.setViewpoint}
              icon={<VisibilityIcon />}
            />
          </Grid>
          <Grid item>
            <Slider
              label="Screen elevation"
              onChange={callbacks.setElevation}
              data={state.elevation}
              icon={<HeightIcon />}
            />
          </Grid>
          <Grid item>
            <Slider
              label="Screen diagonal"
              data={state.diagonal}
              onChange={callbacks.setDiagonal}
              icon={<AspectRatioIcon />}
            />
          </Grid>
        </Grid>
      </Box>
      <Divider />
      <Box p={2}>
        <Grid
          container
          direction="column"
          justify="flex-start"
          alignItems="stretch"
        >
          <Resolution
            presets={state.screen.presets}
            {...state.screen.resolution}
          />
        </Grid>
      </Box>
      <Divider />
      <Box p={2}>
        <Grid container justify="center">
          <Grid item>
            <ButtonGroup>
              <Button
                variant="outlined"
                startIcon={<Icon>refresh</Icon>}
                onClick={callbacks.reset}
              >
                Reset
              </Button>
              <Tooltip
                title="Align viewpoint height with screen top"
                placement="bottom"
              >
                <Button
                  variant="outlined"
                  startIcon={<VerticalAlignTopIcon />}
                  onClick={callbacks.align}
                >
                  Align
                </Button>
              </Tooltip>
            </ButtonGroup>
          </Grid>
        </Grid>
      </Box>

      <ExpansionPanel>
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography>Advanced</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <Grid
            container
            direction="column"
            justify="flex-start"
            alignItems="stretch"
          >
            <Slider
              label="Field of view"
              data={state.fov}
              onChange={callbacks.setFOV}
              icon={<SettingsOverscanIcon />}
            />
          </Grid>
        </ExpansionPanelDetails>
      </ExpansionPanel>
    </Grid>
  );
};

export default Controls;
