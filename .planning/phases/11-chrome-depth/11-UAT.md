---
status: testing
phase: 11-chrome-depth
source:
  - 11-01-SUMMARY.md
  - 11-02-SUMMARY.md
  - 11-03-SUMMARY.md
started: "2026-04-23T03:20:00.000Z"
updated: "2026-04-23T03:20:00.000Z"
---

## Current Test

number: 1
name: T1 — THEME-01：系统深色模式
expected: |
  在真机或 Simulator 上：
  1) 将系统外观切到 **深色**。
  2) 依次查看 **Tab 栏、明细 Home、记一笔、账单流、我的（设置）**。
  3) 正文与背景对比度可接受，无大面积不可读文字或「仍像浅色硬套」的违和。
  若以上成立 → 通过。
awaiting: user response

## Tests

### 1. T1 — THEME-01：系统深色模式
expected: 系统深色下 Tab、明细、记一笔、账单、设置可读且对比可接受
result: pending

### 2. T2 — A11Y-01：降低透明度
expected: 开启系统「降低透明度」后，Tab 与记一笔 Dock 为不透明降级（非空白）；仍能记一笔→保存→明细可见
result: pending

### 3. T3 — LG-01：Tier-1 spot-check
expected: 明细 Home 快速滚动约 3s 顶栏仍可读；主 Tab 切换 ≥3 次有弹簧感；记一笔 Dock 主操作有 spring 回弹
result: pending

### 4. T4 — DATA-02：杀进程冷启动
expected: 记一笔含识别串 DATA02-20260422、金额 0.02→明细可见；App Switcher 杀进程→≥5s→冷启动→仍可查到（同 Phase 10 DATA-02-SMOKE）
result: pending

## Summary

total: 4
passed: 0
issues: 0
pending: 4
skipped: 0
blocked: 0

## Gaps

[none yet]

---

## 设备元数据（可选）

| 项 | 值 |
|----|-----|
| **Executor** | ________________ |
| **Device / OS / Expo** | ________________ |
| **Build** | Dev client 或 Expo Go |

## REQ 映射（参考）

| REQ | 测试 |
|-----|------|
| THEME-01 | T1 |
| A11Y-01 | T2 |
| LG-01 | T3 |
| DATA-02 | T4 |

## Accepted deviations

| 项 | 原因 | 处理 |
|----|------|------|
| （无则 None） | | |

## Sign-off

- **执行人 / 日期：** ________________
- **T1–T4 全通过或已记 deviation：** [ ]
