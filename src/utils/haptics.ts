/**
 * 触感反馈 wrapper —— 对齐 `.planning/IOS26-DESIGN-GUIDE.md` §13。
 * 所有调用都 try/catch，系统无触感硬件时静默失败。
 */
import * as Haptics from "expo-haptics";

async function safe<T>(fn: () => Promise<T>): Promise<void> {
  try {
    await fn();
  } catch {
    /* 系统无触觉或用户关闭触觉：静默失败 */
  }
}

export const haptic = {
  /** 选择器 tick、分段切换 */
  select: () => safe(() => Haptics.selectionAsync()),

  /** 成功：记一笔保存、预算设置保存 */
  success: () =>
    safe(() =>
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success),
    ),

  /** 警告：保留给将来的 blocking 操作（当前本仓库不使用） */
  warning: () =>
    safe(() =>
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning),
    ),

  /** 错误：校验失败、删除确认前 */
  error: () =>
    safe(() =>
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error),
    ),

  /** 轻触：列表按压、FAB 呼出、Modal 出现 */
  light: () =>
    safe(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)),

  /** 中触：长按进入编辑、FAB 按下 */
  medium: () =>
    safe(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)),
} as const;

export type HapticKind = keyof typeof haptic;
