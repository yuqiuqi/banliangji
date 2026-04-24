import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("expo-haptics", () => ({
  selectionAsync: vi.fn(() => Promise.resolve()),
  notificationAsync: vi.fn(() => Promise.resolve()),
  impactAsync: vi.fn(() => Promise.resolve()),
  NotificationFeedbackType: {
    Success: "success",
    Warning: "warning",
    Error: "error",
  },
  ImpactFeedbackStyle: { Light: "light", Medium: "medium", Heavy: "heavy" },
}));

import * as Haptics from "expo-haptics";
import { haptic } from "./haptics";

const selectionAsync = Haptics.selectionAsync as ReturnType<typeof vi.fn>;
const notificationAsync = Haptics.notificationAsync as ReturnType<typeof vi.fn>;
const impactAsync = Haptics.impactAsync as ReturnType<typeof vi.fn>;

describe("haptic wrappers", () => {
  beforeEach(() => {
    selectionAsync.mockClear();
    notificationAsync.mockClear();
    impactAsync.mockClear();
  });

  it("select() calls selectionAsync once", async () => {
    await haptic.select();
    expect(selectionAsync).toHaveBeenCalledTimes(1);
  });

  it("success() calls notificationAsync with Success", async () => {
    await haptic.success();
    expect(notificationAsync).toHaveBeenCalledWith("success");
  });

  it("warning() calls notificationAsync with Warning", async () => {
    await haptic.warning();
    expect(notificationAsync).toHaveBeenCalledWith("warning");
  });

  it("error() calls notificationAsync with Error", async () => {
    await haptic.error();
    expect(notificationAsync).toHaveBeenCalledWith("error");
  });

  it("light() calls impactAsync with Light", async () => {
    await haptic.light();
    expect(impactAsync).toHaveBeenCalledWith("light");
  });

  it("medium() calls impactAsync with Medium", async () => {
    await haptic.medium();
    expect(impactAsync).toHaveBeenCalledWith("medium");
  });

  it("swallows errors silently when haptics unavailable", async () => {
    selectionAsync.mockRejectedValueOnce(new Error("no haptics"));
    await expect(haptic.select()).resolves.toBeUndefined();
  });
});
