# Phase 14 — Verification（v3.0 动效 · 交互）

**阶段：** 14  
**关联：** `14-UI-SPEC.md`、`14-REVIEWS.md` Planner Directives、`IOS26-MOTION-INTERACTION-SPEC.md`

---

## Spot-check 矩阵（手测）

| 项 | 浅色 | 深色 | Reduce Motion | 备注 |
|----|------|------|---------------|------|
| Reduce Motion：按压无 scale / stagger 降级 | ☐ | ☐ | ☐ | |
| 分段 Spring Thumb（Chart / SegmentedTwo） | ☐ | ☐ | ☐ | |
| 图表柱 stagger + 快速切换无叠影 | ☐ | ☐ | ☐ | |
| 列表入场 stagger（≤12 行） | ☐ | ☐ | ☐ | Home / Chart / Asset |
| Modal spring + `modalScrim` | ☐ | ☐ | ☐ | Budget / Asset |
| Header collapse 无列表跳变 | ☐ | ☐ | ☐ | Budget / Asset / Mine |
| SpringPressable 主路径 | ☐ | ☐ | ☐ | |
| haptics（分段 / 保存 / 删除 / Modal） | ☐ | ☐ | — | |

---

## 自动化

- `npm run verify` 退出码 0

---

## Accepted deviation

| ID | 范围 | 理由 | 跟进 |
|----|------|------|------|
| — | — | （执行中填写） | — |
