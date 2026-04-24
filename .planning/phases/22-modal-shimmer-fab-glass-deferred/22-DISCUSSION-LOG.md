# Phase 22: Modal 材质化与 Shimmer/FAB — Discussion Log

> 审计用；计划与实现以 `22-CONTEXT.md` 为准。

**Date:** 2026-04-24  
**Phase:** 22-modal-shimmer-fab-glass-deferred  
**Mode:** 单次会话、无 TUI；灰区在 ROADMAP / REQUIREMENTS / 代码扫描上收束。

---

## Modal 覆盖范围

| Option | 描述 | Selected |
|--------|------|----------|
| A | 仅 Budget + Asset | ✓ 作为必做第一波 |
| B | 必做含 Home 月份 Modal |  |
| C | 全站所有 Modal 一次性 |  |

**Notes:** 选 A + CONTEXT 中 **D-22-01b** 将 Home 列为可选第二波/Deferred。

---

## GlassShimmer 触发策略

| Option | 描述 | Selected |
|--------|------|----------|
| A | 按压 `pressIn` 短触发 | ✓ 默认 |
| B | 常驻循环 shimmer |  |
| C | 仅首屏出现一次 |  |

---

## 与 Phase 21 的依赖

| Option | 描述 | Selected |
|--------|------|----------|
| A | 硬阻塞：Phase 21 全绿才允许 Phase 22 |  |
| B | 按 ROADMAP：可并行，团队自负回归 | ✓ 写入 CONTEXT 依赖说明 |

---

## Deferred

- Home `Modal` 第二波
- 陀螺仪 / Skia 等
