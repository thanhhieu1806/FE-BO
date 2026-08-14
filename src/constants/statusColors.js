import { text, surface, chart } from '../design-tokens';

export const STATUS_COLORS = {
  Successful: {
    color: text.success,
    background: surface.dimGreen,
  },
  Failed: {
    color: text.error,
    background: surface.dimRed,
  },
  Pending: {
    color: text.warning,
    background: surface.dimYellow,
  },
};
export const METHOD_COLORS = {
  Face: chart.donut.face,
  face: chart.donut.face,
  Fingerprint: chart.donut.fingerprint,
  fingerprint: chart.donut.fingerprint,
  Iris: chart.donut.iris,
  iris: chart.donut.iris,
  Palm: chart.donut.palm,
  palm: chart.donut.palm,
  Visitor: chart.donut.visitor,
  visitor: chart.donut.visitor,
};
