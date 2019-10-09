import { in2cm, getPPD, degreeize, percentize, dToR } from "./util";

export const getAbsSize = (n, fov) =>
  (n * Math.sin(dToR(fov / 2))) / Math.sin(dToR(fov / 2) + dToR(90));
const getDeg = (a, b) => Math.atan(a / b) * (180 / Math.PI);

const update = draft => {
  // fov
  const {
    sliders,
    scene: { vars: sceneVars },
    rowData,
    resolution: { x: xRes, y: yRes },
  } = draft;
  const {
    fov: { value: fov },
    depth: {
      range: [, maxDepth],
      value: depth,
    },
    diagonal: { value: diagonalIn },
    elevation: { value: elevation },
    viewpoint: { value: viewpoint },
  } = sliders;
  const { aspectRatio } = sceneVars;
  const maxAbsSize = getAbsSize(maxDepth, fov);
  draft.maxAbsSize = maxAbsSize;
  const absSize = getAbsSize(depth, fov);
  draft.absSize = absSize;
  // screen size
  const diagonalCm = in2cm(diagonalIn);
  const screenWidth = Math.round(
    (diagonalCm * xRes) / Math.sqrt(xRes ** 2 + yRes ** 2),
  );
  draft.screen.size.width = screenWidth;
  const screenHeight = Math.round(screenWidth / (xRes / yRes));
  draft.screen.size.height = screenHeight;
  // relativize
  const ratio = 100 / maxAbsSize;
  draft.ratio = ratio;
  const format = n => percentize(n * ratio);
  draft.screen.vars.width = format(screenWidth);
  draft.screen.vars.height = format(screenHeight);
  draft.screen.vars.elevation = percentize(elevation * ratio);
  // scene size
  const zoom = maxAbsSize / absSize;
  sceneVars.ratio = ratio;
  sceneVars.zoom = zoom;
  sceneVars.containerWidth = percentize(zoom * 100);
  sceneVars.containerHeight = percentize(zoom * 100 * aspectRatio);
  sceneVars.tileSize = percentize(100 / (maxAbsSize / 100));
  sceneVars.viewpointOffset = percentize(viewpoint * ratio);
  // data rows
  const centerPoint = elevation + screenHeight / 2 - viewpoint;
  const centerAngle = getDeg(centerPoint, depth);
  rowData.degree.value = degreeize(Math.round(centerAngle));
  const ppi = Math.round(Math.hypot(xRes, yRes) / diagonalIn);
  const angleDistance = Math.hypot(centerPoint, depth);
  rowData.ppi.value = ppi;
  const ppd = getPPD(xRes, yRes, diagonalIn, angleDistance);

  rowData.ppd.value = Math.round(ppd * 10) / 10;
  // viewpoint measure
  const viewpointMeasureHeight = elevation + screenHeight / 2 - viewpoint;
  sliders.viewpoint.height = viewpointMeasureHeight * ratio;
  sliders.viewpoint.vars.offset = percentize(
    viewpointMeasureHeight < 0
      ? (elevation + screenHeight / 2) * ratio
      : viewpoint * ratio,
  );
  // alignment
  draft.aligned = Math.round((elevation + screenHeight) * 10) / 10 - 6;
};

export default update;
