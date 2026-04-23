/**
 * Global spring / timing tokens — Phase 14 (ANIM-01).
 * Do not hardcode damping/stiffness in screens; import from here.
 */
export const SPRING = {
  /** Primary: buttons, rows, general transitions */
  UI: { damping: 15, stiffness: 220, mass: 1 },
  /** Segmented thumb / chips */
  THUMB: { damping: 13, stiffness: 260, mass: 0.9 },
  /** Sheets / large surfaces */
  SHEET: { damping: 20, stiffness: 200, mass: 1.1 },
  /** Gesture follow / snap */
  GESTURE: { damping: 12, stiffness: 300, mass: 1 },
} as const;

/** Reduce Motion: minimal bounce */
export const REDUCE_SPRING = { damping: 50, stiffness: 400, mass: 1 };

export const FADE_MS = { fast: 120, normal: 200, slow: 350 } as const;
