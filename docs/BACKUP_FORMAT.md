# 半两记 · 备份格式 v1（内部数据层）

本文件描述 **PR 阶段的数据层能力**，不表示 App 目前已经支持用户从界面导入或导出文件。

## 包含数据

JSON 顶层包含 `format: "banliangji/backup"`、`version: 1`、ISO 时间 `exportedAt` 和 `data`：

- `bills`：`bill_list` 的所有账单及原始 ID。
- `budgets`：`budget_cap` 月预算（包括全局预算）。
- `assets`：`asset_account` 资产余额及原始 ID。

`src/db/backupFormat.ts` 定义、验证并规范化该格式；`backupRepository.ts` 实现导出及事务化整体恢复。保留原始 ID 以避免引用失配。**版本不匹配时直接拒绝恢复，不能把未知版本当作 v1 处理**；未来如修改数据库字段，应新增显式迁移器并增加跨版本测试。

## 恢复安全边界

1. 完整解析并验证 JSON，再进行任何数据库写操作。
2. 恢复是 **全部替换** 而非合并；调用方必须显式传入 `{ replaceAll: true }`。
3. 使用 `expo-sqlite` 的 `withTransactionSync`，插入失败时回滚整个事务。
4. 所有 SQL 值使用占位符绑定，绝不拼接 JSON 用户字段。
5. 大文件和超大数组有上限，以降低同步 JSON 解析和 SQLite 导入阻塞 UI 的风险。

## 上线前仍须完成

- 原生文件导出、系统分享、文件选择、导入预览和二次确认交互；**不要**直接在现有「我的」页面开放无确认的 `restoreBackupJson`。
- iOS/Android 真机备份 → 清库 → 恢复回放，以及中途错误回滚测试。
- 恢复后的页面状态重新读取与用户提示；导出文件的隐私提醒（账本备份包含敏感财务数据）。
- 大账本性能验证、备份存储和删除策略。

本 PR 只交付基础模块、契约与 Vitest 数据格式测试，不声称已完成端到端用户备份体验。
