---
phase: 14
reviewers: [gemini, codex]
reviewed_at: "2026-04-23T17:00:00.000Z"
plans_reviewed: []
note: "Pre-plan review — no PLAN.md exists yet. Reviewed: REQUIREMENTS.md v3.0 + IOS26-MOTION-INTERACTION-SPEC.md"
---

# Cross-AI Plan Review — Phase 14 (Pre-Plan)

> **context:** Phase 14 has no PLAN.md yet. This review covers `REQUIREMENTS.md` (9 items: ANIM-01~06, INT-01, HAP-01, MOT-01) and `IOS26-MOTION-INTERACTION-SPEC.md`.  
> Use `/gsd-plan-phase 14 --reviews` to incorporate feedback into the upcoming plan.

---

## Gemini Review ✓

### 1. Summary
The overall approach is exceptionally well-structured and ambitious, transitioning the app from a functional utility to a high-end "Liquid Glass" experience. By centralizing motion constants in `src/theme/motion.ts` and standardizing interaction logic via `useSpringPress`, the plan ensures a level of UI consistency rarely seen in React Native apps. The focus on accessibility (Reduce Motion) and sensory feedback (Haptics) demonstrates a mature understanding of modern mobile design standards.

### 2. Strengths
- **Centralized Motion Tokens:** Moving away from hardcoded damping/stiffness to a semantic `SPRING` object is a best practice that facilitates global "feel" tuning.
- **Accessibility Integration:** Making `MOT-01` (Reduce Motion) a foundational requirement rather than an afterthought ensures compliance and user comfort.
- **Standardized Haptic Language:** Mapping specific app events (delete, save, select) to distinct haptic patterns creates a "physical" mental model for the user.
- **Declarative Staggers:** Using Reanimated 4.x's improved animation sequencing for charts and lists will significantly increase the perceived "premium" quality of the data transitions.

### 3. Concerns

- **Migration Scope: `useSpringPress` (Severity: HIGH)**  
  Replacing *all* `Pressable` instances with a custom hook across the entire app is a high-risk operation. Many `Pressable` implementations likely use specific props (`hitSlop`, `onLongPress`, `delayLongPress`, or complex `style` functions) that a single hook might not capture without becoming overly complex.

- **Animation Overlap & Race Conditions (Severity: MEDIUM)**  
  `ANIM-03` (Chart staggers) and `ANIM-04` (List staggers) use delays based on index. If a user rapidly toggles between "Week" and "Month" views, the staggered animations may overlap or trigger multiple times, leading to visual "fluttering" or jank if not properly cancelled.

- **Layout Stability in Header Collapse (Severity: MEDIUM)**  
  `ANIM-06` (Header collapse 72pt → 44pt) often causes list-jump issues in React Native if the `contentInset` or `scrollIndicatorInsets` are not perfectly synced with the animated height.

- **Reanimated 4.x / Worklet Stability (Severity: LOW/MEDIUM)**  
  Some patterns (like shared values in `useMemo`) might behave differently than in 3.x. The "staggered growth" on charts needs to ensure that if the component unmounts mid-animation, no worklets are orphaned.

- **Performance on Low-End Devices (Severity: LOW)**  
  While Reanimated runs on the UI thread, applying `FadeInDown.springify()` to long lists (50+ bill items) can cause frame drops on older Android hardware during initial render.

### 4. Suggestions

- **Component over Hook for Pressables:** Instead of `useSpringPress.ts`, consider creating a `SpringPressable.tsx` component. Easier to do "Search and Replace" from `<Pressable` to `<SpringPressable` while maintaining the standard props API.
- **Stagger Limit:** For `ANIM-03/04`, implement a "Max Stagger Count" (e.g., stagger only first 10–12 items). For items 13+, use a simple fade or shorter delay.
- **Animation Cancellation:** Ensure `withSpring` animations in the chart are explicitly stopped/overwritten when a period change is triggered before the previous animation finishes.
- **Haptic Availability Check:** In `src/utils/haptics.ts`, wrap calls in try/catch to avoid silent failures on older devices or emulators.
- **Phased Rollout of `useSpringPress`:** Test on Home and Calculator screens first before applying to all screens.

### 5. Risk Assessment
**Risk Level: MEDIUM**

The technical requirements (Reanimated/Haptics) are standard for high-end Expo apps, but the **breadth of the refactor** (9 requirements covering every screen) introduces regression risk. Replacing the core interaction primitive (`Pressable`) and the core data visualization (Charts) simultaneously requires a disciplined `npm run verify` and manual QA cycle. The "Reduce Motion" requirement acts as a safety valve for performance/accessibility issues.

---

## Codex Review ✗

> **Status:** Timed out after 3+ minutes — no response received. Codex CLI did not return a result within the allotted window.

---

## Consensus Summary

### Agreed Strengths (Gemini)
- Centralizing spring constants in `motion.ts` is the right architectural foundation
- Reduce Motion + haptics as first-class requirements shows design maturity
- Reanimated stagger for charts/lists will measurably improve perceived quality

### Agreed Concerns (Single-reviewer; elevate for planning)
- **HIGH: `useSpringPress` full-app Pressable migration** — consider `SpringPressable.tsx` component wrapping `Pressable` props instead of a pure hook, to minimize refactor risk and maintain `hitSlop` / `onLongPress` passthrough
- **MEDIUM: Stagger race condition** — rapid period switching can cause overlapping stagger animations; add cancellation logic (cancel pending `setTimeout` IDs on re-trigger)
- **MEDIUM: Header Collapse layout jumps** — `contentInset` must track animated header height to avoid scroll position jumping
- **LOW: Bar chart useMemo hooks rule** — `points.map(() => useSharedValue(0))` inside `useMemo` violates React hooks rules; move to a `useEffect` + `useRef` pattern instead

### Divergent Views
- N/A (single successful reviewer)

### Planner Directives (incorporate via `/gsd-plan-phase 14 --reviews`)
1. **Rename INT-01** to use `SpringPressable.tsx` component pattern instead of bare hook, keeping `Pressable` props surface
2. **ANIM-03/04**: Add stagger cancellation requirement — `clearTimeout` on all pending stagger timers when data changes
3. **ANIM-03**: Fix bar chart shared values — use `useRef<SharedValue<number>[]>` initialized in `useEffect`, not `useMemo`
4. **ANIM-06**: Add `contentInset` compensation requirement to avoid list-jump when header height changes
5. **HAP-01**: Add try/catch guard in `haptics.ts` wrapper
6. **Phase scope**: Consider splitting into Wave 1 (infrastructure: motion.ts + SpringPressable + haptics) and Wave 2+ (per-screen features) for safer rollout
