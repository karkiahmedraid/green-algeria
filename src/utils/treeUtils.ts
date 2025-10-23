import type { Point } from '../types/tree.types';

/**
 * Darkens a hex color by a specified amount
 */
export const darkenHex = (hex: string, amount = 20): string => {
  const c = hex.replace('#', '');
  const num = parseInt(c, 16);
  let r = (num >> 16) - amount;
  let g = ((num >> 8) & 0x00FF) - amount;
  let b = (num & 0x0000FF) - amount;
  r = Math.max(0, r);
  g = Math.max(0, g);
  b = Math.max(0, b);
  return '#' + ((r << 16) | (g << 8) | b).toString(16).padStart(6, '0');
};

/**
 * Returns the accurate Algeria border path coordinates
 * Scaled from SVG viewBox (0 0 912 1024) to canvas (800x600)
 */
export const getAlgeriaBorderPath = (): Point[] => {
  const scale = (x: number, y: number): Point => ({
    x: (x / 912) * 800,
    y: (y / 1024) * 600
  });

  return [
    // Starting from northwest, going clockwise around Algeria
    scale(345, 80),    // Northwest corner near Morocco
    scale(407, 48),
    scale(457, 31),
    scale(492, 28),
    scale(526, 19),
    scale(572, 13),    // Northern coast area
    scale(603, 20),
    scale(634, 13),
    scale(671, 10),
    scale(696, 6),
    scale(731, 11),    // Northeast area
    scale(750, 8),
    scale(740, 70),    // Eastern border start
    scale(741, 125),
    scale(721, 160),
    scale(710, 207),
    scale(738, 240),
    scale(777, 282),
    scale(795, 374),
    scale(792, 385),
    scale(809, 448),
    scale(818, 523),
    scale(817, 592),   // Eastern border middle
    scale(813, 598),
    scale(822, 644),
    scale(832, 672),
    scale(841, 693),
    scale(892, 710),   // Southeast corner
    scale(901, 763),
    scale(893, 783),
    scale(748, 899),   // Southern border
    scale(711, 933),
    scale(648, 991),
    scale(540, 1023),  // Southwest area
    scale(529, 1020),
    scale(498, 963),
    scale(476, 948),
    scale(458, 935),
    scale(438, 919),
    scale(430, 908),
    scale(416, 885),
    scale(227, 733),   // Western border
    scale(7, 557),
    scale(2, 466),
    scale(8, 454),
    scale(40, 428),
    scale(88, 409),
    scale(104, 397),
    scale(135, 394),
    scale(155, 382),
    scale(169, 363),
    scale(215, 340),
    scale(215, 316),
    scale(214, 312),
    scale(247, 290),
    scale(254, 283),
    scale(268, 271),
    scale(323, 270),
    scale(328, 265),
    scale(330, 251),
    scale(310, 212),
    scale(310, 210),
    scale(307, 188),
    scale(307, 176),
    scale(307, 160),
    scale(306, 146),
    scale(300, 132),
    scale(292, 123),   // Back to northwest
    scale(302, 111),
  ];
};

/**
 * Checks if a point is inside the Algeria border using ray casting algorithm
 */
export const isPointInAlgeria = (x: number, y: number): boolean => {
  const path = getAlgeriaBorderPath();
  let inside = false;

  for (let i = 0, j = path.length - 1; i < path.length; j = i++) {
    const xi = path[i].x;
    const yi = path[i].y;
    const xj = path[j].x;
    const yj = path[j].y;

    const intersect = ((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }

  return inside;
};
