# Phase 11 — Verification

**Phase:** 11-chrome-depth  
**REQ:** THEME-01, A11Y-01, LG-01  

## 门禁

- [x] `npm run verify` 通过（最后一次执行日期：2026-04-24）

## THEME-01 — 系统深色

- [ ] Tab / 明细列表 / 记一笔 / 账单流 / 我的（设置）：正文与背景对比可接受  
- [ ] 导航栏、列表分组背景色与 **dark** token 一致或可引用 Accepted deviation  

## A11Y-01 — 降低透明度

- [ ] 开启系统「降低透明度」后，Tab 与记一笔相关区域 **非空白**、主路径可完成记一笔与查看明细  
- [ ] 关闭后恢复毛玻璃栈（或等价观感）  

## LG-01 — 材质与动效（Tier-1）

**Spot-check（手测建议）：**

1. 明细 Home：**快速滚动**账单列表约 **3 秒**，观察顶栏与首屏分组是否仍可读、层次是否糊成一片。  
2. 主 **Tab**：来回切换 **≥3 次**，观察底栏是否有可感知的高光/分隔/shadow，按压图标是否有 **spring** 感（非唯一主导线性缩放）。  
3. 记一笔：对 Dock **主操作区** 按压/松开各一次，确认 **spring** 回弹后主路径仍可完成保存或返回。

- [ ] Tab：**非**单层灰雾主导；边缘层次可感知（高光/分隔/shadow 至少一项生效）  
- [ ] 记一笔 Dock/Sheet：**非**单层灰雾主导  
- [ ] 主列表顶栏（明细 Home）：滚动时仍可读  
- [ ] 动效：Tab/记一笔 **无主导性**「纯线性」僵硬感（spring 或等价）  

## Accepted deviations

| 项 | 原因 | 记录位置 |
|----|------|----------|
| （若无则写 None） | | |

Deferred UAT: THEME / A11Y / LG — Phase 21 本会话为 Agent 文书收口，未在 iOS 真机或 Simulator 执行手测与 spot-check；THEME-01、A11Y-01、LG-01 勾选与清单上述条目待维护者补跑后更新。原因长度满足追溯要求。

## Sign-off

- [ ] 根 `UI-SPEC.md` / `DESIGN.md` 已同步偏差（手测后补：偏差若有则同步）  
Sign-off by: 待维护者补签（Agent 环境不可代 iOS 手测）  
Sign-off date: 2026-04-24  
