---
phase: 11
slug: chrome-depth
status: draft
extends: ../../../UI-SPEC.md
created: 2026-04-22
---

# Phase 11 — UI Design Contract（增量）

> **基线：** 仓库根目录 `UI-SPEC.md` + `DESIGN.md` + Phase 9 交付的 iOS 26 Chrome。  
> **本文件**只锁定 Phase 11 新增的 **深色**、**降低透明度**、**Liquid Glass 纵深（工程近似）** 合同；不重复定义其他产品的布局样板 / 业务 IA。

---

## 1. 深色外观（THEME-01）

| 项 | 合同 |
|----|------|
| 来源 | 仅 **系统** `light` / `dark`；**无**应用内主题切换（Phase 11） |
| Token | 与现有 `colors` **相同键名** 提供 dark 值；导航/画布/表面/label/separator/accent 必须成套 |
| 对比 | 关键屏（Tab、明细列表、记一笔、账单流、设置）**无**大面积与背景融为一体的正文 |
| 偏差 | 记录在根 `UI-SPEC.md` 或 `DESIGN.md` 的 Accepted deviation |

---

## 2. 降低透明度（A11Y-01）

| 项 | 合同 |
|----|------|
| 检测 | 使用 RN `AccessibilityInfo` 订阅「降低透明度」 |
| 表现 | 原 `BlurView` 区域变为 **不透明底** + **可辨识分隔/字色**；**禁止**空白或不可点 |
| 范围 | 至少：**Tab 栏**、**记一笔**相关毛玻璃区；其余 Tier-1 与 PLAN 一致 |

---

## 3. Liquid Glass 纵深（LG-01）

| 项 | 合同 |
|----|------|
| 目标 | **非像素复刻**；缩小「灰雾 Tab / 线性僵硬 / 无层次」感知 |
| 材质 | 遵循 `11-MATERIAL-MOTION-SPEC.md` §4.1：**Blur + 语义 tint + 可选 hairline + 与层级匹配的 shadow** |
| 动效 | §4.2：**spring** 优先于单调 `timing`；Tier-1：Tab、记一笔 Dock/Sheet 相关 |
| Android | 不透明近似 + 标注；不与 iOS 强行一致 |
| 诚实边界 | 无法 1:1 处 → `11-VERIFICATION.md` + 根设计文档 **Accepted deviation** |

---

## 4. 非目标（与 CONTEXT 一致）

- 任何 **联网** 能力、云资源、账号、远程配置。  
- 自定义原生私有 Glass API（可选 Tier-2，非本 Phase 必达）。

---

## Checker Sign-Off（Phase 11）

- [ ] Dimension 深色：PASS  
- [ ] Dimension 降低透明度：PASS  
- [ ] Dimension 材质/动效 Tier-1：PASS  
- [ ] 与根 `UI-SPEC.md` 无矛盾或已 deviation  

**Approval:** pending
