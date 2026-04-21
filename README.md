# SwiftCostRN

基于 [IANIx/SwiftCost](https://github.com/IANIx/SwiftCost) 思路的 **Expo + TypeScript + SQLite** 离线记账应用：明细、记一笔、日历、图表（支出）、账单详情与编辑删除。

## 开发

```bash
npm install
npm start
```

- iOS：`npm run ios`（需 Xcode）  
- Android：`npm run android`（需 Android SDK / 模拟器）

## 质量门禁（QA-01 / QA-02）

一键跑类型检查、ESLint 与单元测试：

```bash
npm run verify
```

或使用：

```bash
bash scripts/verify.sh
```

单独运行：`npm run typecheck`、`npm run lint`、`npm run test`。

## 版本与发布

- 展示版本：`app.json` → `expo.version` 与 `package.json` → `version` 应保持**一致**。  
- 发布前清单：见 [docs/RELEASE-CHECKLIST.md](docs/RELEASE-CHECKLIST.md)。

## 规划

产品与技术决策见仓库内 `.planning/PROJECT.md`（GSD）。
