---
status: testing
phase: 10-persist-uat
source:
  - 10-01-SUMMARY.md
  - 10-02-SUMMARY.md
started: "2026-04-23T03:10:00.000Z"
updated: "2026-04-23T03:10:00.000Z"
---

## Current Test

number: 1
name: DATA-02 — 杀进程冷启动后测试账单仍在
expected: |
  按 `.planning/phases/10-persist-uat/DATA-02-SMOKE.md`：
  1) 记一笔，备注含识别串 `DATA02-20260422`（金额如 0.02 支出），保存。
  2) 在明细或账单列表中能看到该条。
  3) 用 Kill protocol：App Switcher 上划掉 App（或等价强制停止），等待 ≥5s，再从图标冷启动（非热重载）。
  4) 冷启动后仍在列表中找到同一识别串。
  若四步均成立 → 视为通过。
awaiting: user response

## Tests

### 1. DATA-02 — 杀进程冷启动后测试账单仍在
expected: 杀进程并冷启动后，明细/账单中仍可查到识别串 DATA02-20260422 的测试账单（步骤见 DATA-02-SMOKE.md）
result: pending

### 2. 主路径回归 — 冷启动后无红屏且能完成「记一笔 → 明细」
expected: 冷启动 App 后，进入明细可滚动；打开记一笔可正常保存一条临时记录并在明细可见（不要求与测试 1 同一条）
result: pending

## Summary

total: 2
passed: 0
issues: 0
pending: 2
skipped: 0
blocked: 0

## Gaps

[none yet]
