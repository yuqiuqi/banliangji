# Phase 11: chrome-depth — Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.  
> Decisions are captured in `11-CONTEXT.md`.

**Date:** 2026-04-22  
**Phase:** 11-chrome-depth  
**Mode:** `--auto --analyze`  
**Areas discussed:** 深色外观策略, 降低透明度降级策略, LG-01 材质栈落地形态, 动效改造范围  

---

## 深色外观策略（THEME-01）

**Trade-off analysis**

| Approach | Pros | Cons |
|----------|------|------|
| 仅跟随系统 `useColorScheme` + 语义 token | 与 iOS 设置一致、实现面可控、符合 REQ「系统深色」 | 无法在应用内单独切浅色 |
| 应用内开关 + 系统默认 | 用户可控 | 当前无开关；增加状态持久化与 QA 面，易膨胀 Phase 11 |
| 硬编码 dark palette 无系统联动 | 快 | 违背系统外观与无障碍预期 |

**Recommended:** 仅跟随系统 + 成对语义 token（`11-CONTEXT` D11-01 / D11-02）。

| Option | Description | Selected |
|--------|-------------|----------|
| 系统 + token | `useColorScheme` 驱动；扩展 light/dark 语义色 | ✓ |
| 应用内开关 | Phase 11 新增主题设置 | |
| 仅文档不落地 | 不满足 THEME-01 | |

**User's choice:** `[auto]` 推荐项 — 系统 + token；不新增应用内开关。  
**Notes:** 与 Phase 9「Dark follow-up → Phase 11」一致。

---

## 降低透明度降级策略（A11Y-01）

**Trade-off analysis**

| Approach | Pros | Cons |
|----------|------|------|
| 单一 `AdaptiveBlur` / hook + 订阅 | 一致行为、易测、符合 SPEC §4.3 | 需梳理所有 Blur 调用点 |
| 各屏独立判断 | 局部快 | 易遗漏、风格不一致 |

**Recommended:** 集中订阅 + 可复用容器（`11-CONTEXT` D11-03 / D11-04）。

| Option | Description | Selected |
|--------|-------------|----------|
| 集中封装 | AccessibilityInfo + 统一降级组件 | ✓ |
| 分散分支 | 各屏手写 | |

**User's choice:** `[auto]` 推荐项 — 集中封装。  

---

## LG-01 材质栈落地形态

**Trade-off analysis**

| Approach | Pros | Cons |
|----------|------|------|
| `ios/` 下新增分层表面原语（SPEC §4.1） | 与 D9-04 组合原语一致、Tier-1 统一 | 需一次抽象设计 |
| 逐屏复制 Blur+叠层 | 局部直观 | 难维护、易「灰雾 Tab」 |

**Recommended:** 共享材质栈原语 + Tier-1 接入（`11-CONTEXT` D11-05）。

| Option | Description | Selected |
|--------|-------------|----------|
| 共享原语 | `src/components/ios/` 分层组件 | ✓ |
| 逐屏叠层 | 无共享抽象 | |

**User's choice:** `[auto]` 推荐项 — 共享原语。  

---

## 动效改造范围

**Trade-off analysis**

| Approach | Pros | Cons |
|----------|------|------|
| Tier-1 最小集：Tab、记一笔、关键按压 | 满足 LG-01 与性能风险可控 | 其余屏仍可能偏线性 |
| 全应用 Pressable spring | 观感统一 | Phase 11 改动面过大 |

**Recommended:** Tier-1 最小集 + Reanimated spring（`11-CONTEXT` D11-06）。

| Option | Description | Selected |
|--------|-------------|----------|
| Tier-1 最小集 | Tab / 记一笔 Dock / Sheet 相关 spring | ✓ |
| 全局动效刷新 | 全 Pressable | |

**User's choice:** `[auto]` 推荐项 — Tier-1 最小集。  

---

## Claude's Discretion

- Token 文件结构、具体组件命名由 plan-phase / 实现阶段在 `11-CONTEXT` 原则下决定。

## Deferred Ideas

- 应用内主题开关；自定义原生 Liquid Glass；任何联网能力 — 见 `11-CONTEXT.md` `<deferred>`。
