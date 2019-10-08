import React from "react";
import styles from "./Presets.module.scss";
import { useCallbackContext } from "./providers";
// import Grid from "@material-ui/core/Grid";
// import Button from "@material-ui/core/Button";
// import Icon from "@material-ui/core/Icon";
// import FormControl from "@material-ui/core/FormControl";
// import FormLabel from "@material-ui/core/FormLabel";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
// import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
// import IconButton from "@material-ui/core/IconButton";
// import CommentIcon from "@material-ui/icons/RemoveCircle";

import { strip } from "./util";

const presets = [
  {
    label: "Apple Retina 5K iMac",
    x: 5120,
    y: 2880,
    diagonal: 27,
  },
  {
    label: "iMac with Retina 4K Display",
    x: 4096,
    y: 2304,
    diagonal: 21.5,
  },
  {
    label: 'MacBook Pro (3rd generation) 15"',
    x: 2880,
    y: 1800,
    diagonal: 15.4,
  },
  {
    label: "Acer Predator X34",
    x: 3440,
    y: 1440,
    diagonal: 34,
  },
  {
    label: "LG 88BH7D-B",
    x: 3840,
    y: 1080,
    diagonal: 88,
  },
  {
    label: '21.5" FHD',
    x: 1920,
    y: 1080,
    diagonal: 21.5,
  },
  {
    label: '24" FHD',
    x: 1920,
    y: 1080,
    diagonal: 24,
  },
  {
    label: '27" FHD',
    x: 1920,
    y: 1080,
    diagonal: 27,
  },
  {
    label: '27" QHD',
    x: 2560,
    y: 1440,
    diagonal: 27,
  },
  {
    label: '32" FHD',
    x: 1920,
    y: 1080,
    diagonal: 32,
  },
  {
    label: '32" UHD',
    x: 3840,
    y: 2160,
    diagonal: 32,
  },
  {
    label: '43" UHD',
    x: 3840,
    y: 2160,
    diagonal: 43,
  },
  {
    label: '55" UHD',
    x: 3840,
    y: 2160,
    diagonal: 55,
  },
  {
    label: '65" UHD',
    x: 3840,
    y: 2160,
    diagonal: 65,
  },
  {
    label: '75" UHD',
    x: 3840,
    y: 2160,
    diagonal: 75,
  },
];

const Presets = () => {
  const callbacks = useCallbackContext();

  const handleApply = state => () => {
    callbacks.apply(state);
    // callbacks.align();
  };
  return (
    <List className={styles.Presets}>
      {presets.map(state => {
        const key = strip(JSON.stringify(state));
        const labelId = `checkbox-list-label-${key}`;

        return (
          <ListItem
            key={key}
            role={undefined}
            dense
            button
            onClick={handleApply(state)}
          >
            <ListItemText id={labelId} primary={state.label} />
            <ListItemSecondaryAction>
              {/* <IconButton edge="end" aria-label="comments">
                <CommentIcon />
              </IconButton> */}
            </ListItemSecondaryAction>
          </ListItem>
        );
      })}
    </List>
  );
};

export default Presets;
