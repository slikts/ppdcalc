import { inToCm, cmToIn, degreeize, percentize, dToR } from "./util";

export const getAbsSize = (n, fov) =>
  (n * Math.sin(dToR(fov / 2))) / Math.sin(dToR(fov / 2) + dToR(90));
const getDeg = (a, b) => Math.atan(a / b) * (180 / Math.PI);

export const dataKeys = ["depth", "diagonal", "elevation", "viewpoint", "fov"];

const update = draft => {
  // fov
  const {
    fov: { value: fov },
  } = draft;
  const {
    depth: {
      range: [, maxRange],
      value: depth,
    },
    scene: { vars: sceneVars },
    diagonal: { value: diagonalIn },
  } = draft;
  const maxAbsSize = getAbsSize(maxRange, fov);
  draft.maxAbsSize = maxAbsSize;
  const absSize = getAbsSize(depth, fov);
  draft.absSize = absSize;
  // screen size
  const diagonalCm = inToCm(diagonalIn);
  const { x: xRes, y: yRes } = draft.screen.resolution;
  const screenWidth = Math.round(
    (diagonalCm * xRes) / Math.sqrt(xRes ** 2 + yRes ** 2),
  );
  const screenWidthIn = cmToIn(screenWidth);
  draft.screen.size.x = screenWidth;
  const screenHeight = Math.round(screenWidth / (xRes / yRes));
  const screenHeightIn = cmToIn(screenHeight);
  draft.screen.size.y = screenHeight;
  // relativize
  const ratio = 100 / maxAbsSize;
  draft.ratio = ratio;
  const format = n => percentize(n * ratio);
  draft.screen.vars.width = format(draft.screen.size.x);
  draft.screen.vars.height = format(draft.screen.size.y);
  const {
    elevation: { value: elevation },
  } = draft;
  draft.screen.vars.elevation = percentize(elevation * ratio);
  // scene size
  const { aspectRatio } = sceneVars;
  const zoom = maxAbsSize / absSize;
  sceneVars.ratio = ratio;
  sceneVars.zoom = zoom;
  sceneVars.containerWidth = percentize(zoom * 100);
  sceneVars.containerHeight = percentize(zoom * 100 * aspectRatio);
  sceneVars.tileSize = percentize(100 / (maxAbsSize / 100));
  const viewpointOffset = draft.viewpoint.value;
  sceneVars.viewpointOffset = percentize(viewpointOffset * ratio);
  // data rows
  const { rowData } = draft;
  const centerPoint = elevation + screenHeight / 2 - viewpointOffset;
  // const topPoint = elevation + screenHeight - viewpointOffset;
  const centerAngle = getDeg(centerPoint, depth);
  // const topAngle = getDeg(topPoint, depth);
  // const botAngle = getDeg(elevation - viewpointOffset, depth);
  rowData.degree.value = degreeize(Math.round(centerAngle));
  const ppi = Math.round(Math.hypot(xRes, yRes) / diagonalIn);
  rowData.ppi.value = ppi;
  // const angle = Math.abs(
  //   topAngle > botAngle ? topAngle - botAngle : botAngle - topAngle,
  // );
  console.log({
    width: screenWidthIn,
    screenHeightIn,
    diagonal: diagonalIn,
    depth: cmToIn(depth),
  });
  const ppd =
    xRes /
    2 /
    ((180 / Math.PI) *
      Math.atan(
        ((diagonalIn / Math.sqrt(xRes ** 2 + yRes ** 2)) * (xRes / 2)) /
          cmToIn(depth),
      ));
  rowData.ppd.value = Math.round(ppd * 10) / 10;
  // console.log(angle);
};

export default update;
