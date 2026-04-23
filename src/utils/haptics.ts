import * as ExpoHaptics from "expo-haptics";

/** Segmented control / chip selection */
export function hapticSelect(): void {
  try {
    void ExpoHaptics.selectionAsync();
  } catch {
    /* simulator / unsupported */
  }
}

export function hapticSuccess(): void {
  try {
    void ExpoHaptics.notificationAsync(ExpoHaptics.NotificationFeedbackType.Success);
  } catch {
    /* noop */
  }
}

export function hapticError(): void {
  try {
    void ExpoHaptics.notificationAsync(ExpoHaptics.NotificationFeedbackType.Error);
  } catch {
    /* noop */
  }
}

export function hapticLight(): void {
  try {
    void ExpoHaptics.impactAsync(ExpoHaptics.ImpactFeedbackStyle.Light);
  } catch {
    /* noop */
  }
}

export function hapticMedium(): void {
  try {
    void ExpoHaptics.impactAsync(ExpoHaptics.ImpactFeedbackStyle.Medium);
  } catch {
    /* noop */
  }
}
