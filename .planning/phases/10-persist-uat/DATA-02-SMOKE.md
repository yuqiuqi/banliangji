# DATA-02 — 杀进程冷启动冒烟

## Environment

| 项 | 值 |
|----|-----|
| **Date** | 2026-04-24（文书复核；Kill 手测仍待设备） |
| **Git** | `9c04554`（Phase 21 文书提交；手测 PASS/FAIL 后请更新为当时提交） |
| **Expo** | `~54.0.33` |
| **react-native** | `0.81.5` |
| **iOS target** | `BLOCKED`：设备杀进程手测尚未执行；须补 **Simulator 机型+runtime** 或 **真机型号**（停 Metro 不算杀进程） |

## Kill protocol（排除歧义）

1. **禁止**：将「停止 Metro bundler」「仅断开 JS 调试器」视为 DATA-02 的杀进程 —— **无效**。
2. **必须**：在「记一笔已保存且列表/明细中**可见**该条」之后，使用 **App Switcher 上划掉 App** *或* **设置 → 通用 → iPhone 存储 → App → 删除/卸载前试强制停止**（二选一，执行时写明所用方式）。
3. 杀进程后 **等待 ≥ 5s** 再从图标 **冷启动** App（非热重载）。
4. 冷启动后在 **明细或账单列表** 用测试识别串检索，确认该条仍在。

## Test data

- **识别串（备注/标题）**：`DATA02-20260422`
- **金额**：例如 `0.02`（支出，可辨）

## Steps（维护者执行清单）

1. 冷启动 App → 记一笔 → 填识别串与金额 → 保存。
2. 回到 **明细** 或 **账单**，确认列表中出现该条。
3. 按 **Kill protocol** 杀进程 → 等待 ≥5s → 再冷启动。
4. 在同一入口再次查找识别串 `DATA02-20260422`。

## Optional: SQLite on disk

若在 **Simulator** 上执行，可在取得容器路径后查找 `main.db`，并用 `sqlite3` 查 `bill_list` 是否含该条。

`Skipped (reason):` 当前为自动化编排执行，未启动 Simulator；维护者补跑时可按 `xcrun simctl get_app_container booted <bundle-id> data` 定位。

## Result

Result: BLOCKED

本环境（Agent/CI）无法完成 iOS 真机或 Simulator 的「划掉 App + 冷启动」手测；**Kill protocol 与步骤已书面固化**。维护者在本地按上表执行后，应将本行改为 `Result: PASS` 或 `Result: FAIL` 并补 Environment 表中的设备字段。

**Phase 21（2026-04-24）文书收口：** 已交叉引用 `21-VERIFICATION.md` 与 `REQUIREMENTS` 追溯为 Blocked+理由；**未**将本 `Result:` 伪标为 PASS。

## 下一步取证计划

1. 本地：`npx expo run:ios` 或 Xcode 打开 workspace，按 Steps 执行一遍。
2. 若 `FAIL`：在 **Investigation notes** 填 SQLite/事务结论（见 Phase 10 plan 01 任务 3）；必要时开 bugfix PR。
3. **（Phase 12 · 2026-04-23）** 维护者须在 **2026-05-01** 前于 Simulator/真机完成 Kill protocol，并将本文件 `Result:` 更新为 `PASS` 或 `FAIL`；当前 Agent 会话**不代替**设备划掉 App。
4. **执行人 / 完成日期：** ________________ / ________________（手测责任人填写；逾 **2026-05-01** 未闭合时须在本文件或 `STATE.md` Deferred 写明升级路径）。

## Note on verify

`npm run verify`（typecheck + lint + vitest）**不覆盖**本杀进程场景。

## Investigation notes

N/A — Result was not FAIL.
