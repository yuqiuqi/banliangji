# 结绳记 · Jieshengji

> **结一个绳，记一笔账。**  
> 华夏先民最早的记账之法是 *结绳记事*；本项目以此为名，做一款 **克制、离线、可信** 的中文移动记账 App。

<p align="left">
  <img alt="platform" src="https://img.shields.io/badge/platform-iOS%20%7C%20Android-black">
  <img alt="stack" src="https://img.shields.io/badge/stack-Expo%20SDK%2054%20%2B%20TypeScript-3178c6">
  <img alt="ui" src="https://img.shields.io/badge/UI-iOS%2026%20Liquid%20Glass-007AFF">
  <img alt="license" src="https://img.shields.io/badge/license-JPSAL%20v1.0-red">
  <img alt="status" src="https://img.shields.io/badge/status-v2.3%20executing-blueviolet">
</p>

---

## 为什么叫「结绳记」

- **源头感。** 记账并非现代发明；在文字出现之前，先民以结绳记账、以刻齿记数。项目取其 *"最古老的记账动作"* 为名，提醒自己：**记账的本质是诚实，不是功能堆叠。**
- **独特性。** 在中文独立应用、GitHub 仓库里几乎没有同名作品；短、上口、可作图标。
- **文字美。** "结绳记" 三字同时包含动作（结）、载体（绳）、意图（记），像一句极短的诗。

代码工作名仍使用 `SwiftCostRN`（RN = React Native），后续不改包名以避免大规模重命名。

---

## 它是什么

一个 **完全离线、本地 SQLite、零网络请求** 的个人记账 App。走 **iOS 26 / Liquid Glass** 取向，尽可能把 UI 让位给内容。

### 核心能力

| 模块 | 说明 |
|------|------|
| **明细 Home** | 按时间聚合的分组列表；顶栏材质化，滚动仍可读。 |
| **记一笔** | 模态键盘式计算器 + 分类选择 + 日期/备注；键帽与 Dock 使用 Reanimated spring。 |
| **日历视图** | 单日 / 区间切换；iOS 原生日期选择器。 |
| **图表** | 周 / 月 / 年三档；趋势柱 + 分类构成；支出维度。 |
| **预算 / 资产** | MVP，月预算、净资产与收支概览。 |
| **我的** | 设置入口（数据导出、版本、许可证）。 |
| **深色模式** | 跟随系统；`ThemeContext` + 双调色板。 |
| **无障碍** | 监听 *降低透明度*，Tab 与 Dock 走不透明降级栈。 |

### 设计契约

- 视觉来源：Apple **iOS 26 / Liquid Glass** 官方语义取向（非像素级复刻）。
- 合约文档：根目录 [`UI-SPEC.md`](./UI-SPEC.md)、[`DESIGN.md`](./DESIGN.md)。
- 历史阶段与 UAT：`.planning/phases/*`。

---

## 技术栈

- **React Native 0.81** · **Expo SDK 54** · **TypeScript 5.9**
- **expo-sqlite**（本地持久化，New Architecture）
- **react-native-reanimated 4** + **react-native-worklets**（Tier-1 弹簧动效）
- **expo-blur**（iOS Chrome 材质）
- **React Navigation v7**（Native Stack + Bottom Tabs）
- 工具链：ESLint · Vitest · tsc --noEmit

---

## 快速开始

```bash
# 1. 克隆
git clone https://github.com/yuqiuqi/jieshengji.git
cd jieshengji

# 2. 安装依赖
npm install

# 3. 启动 Metro
npm start              # 选择 i / a 进入平台
# 或：
npm run ios            # iOS 模拟器（需 Xcode）
npm run android        # Android（需 SDK）
```

### 质量门禁

```bash
npm run verify         # typecheck + lint + test
```

单独跑：`npm run typecheck` · `npm run lint` · `npm run test`。

### 首次在新环境 iOS 红屏？

- Expo Go / Dev Client 与 `react-native-worklets` 的 **原生版本必须匹配**。SDK 54 自带的 worklets 原生侧为 `0.6.x`。
- Metro 缓存是第一嫌疑：`npx expo start --clear`，并在真机 / 模拟器 **完全关闭 App 再打开**（不要只 Reload）。
- 自建 `ios/` 目录的 dev client：`cd ios && pod install` 后重新编译。

---

## 规划 · GSD 工作法

本仓库使用 **Get Shit Done (GSD)** 工作法管理里程碑与阶段：

- `ROADMAP` · [.planning/ROADMAP.md](./.planning/ROADMAP.md)
- `STATE` · [.planning/STATE.md](./.planning/STATE.md)
- 各 Phase 的计划、验证、讨论记录：`.planning/phases/*/`
- 已完成里程碑归档：`.planning/milestones/*`

当前里程碑 **v2.3**：Phase 10 持久化 UAT 闭环；Phase 11 深色 / 无障碍 / Liquid Glass 纵深。

---

## 贡献方式

**本项目不接受 Fork、不接受 Pull Request。** 若你有想法或发现问题：

- 前往 [Issues](https://github.com/yuqiuqi/jieshengji/issues) 提交：
  - **Bug 报告**：附截图、机型 / OS / Expo 版本、复现步骤。
  - **功能建议**：描述使用场景与期望行为；请勿直接贴长代码。
  - **安全漏洞**：标题前加 `[security]`，尽量私下先通知；无邮箱可走 Issue，但请先不披露 PoC。

> 提交 Issue 即视为授权作者及团队在项目中自由使用该反馈，详见 [LICENSE](./LICENSE) §4。

---

## 许可证

**JPSAL v1.0 — 结绳记专有源码可见许可证** · 见 [LICENSE](./LICENSE)。

要点（非替代原文）：

- **源码可见，非开源自由软件**；禁止商用。
- **禁止 Fork 后的任何对外公开、再分发、修改**；Fork 按钮虽由 GitHub 平台提供，但法律层面明确禁止。
- **禁止将本作品用于 AI 训练 / 微调数据集。**
- 仅作者本人与作者明确授权的 **结绳记团队成员** 可修改、分发、商用。
- 用户仅可通过 **GitHub Issues** 反馈。

如需商业授权 / 加入团队 / 其他合作，请在 Issues 提出，标题前缀 `[商业授权]` / `[团队加入]`。

---

## 致谢

- 记账 App 思路致敬 [IANIx/SwiftCost](https://github.com/IANIx/SwiftCost)。
- UI 取向源自 Apple **Liquid Glass** 官方设计语言（本项目为工程近似，非授权品牌）。
- 技术栈：Software Mansion、Expo、React Native 社区。

---

<p align="center">
  <sub><i>"上古结绳而治，后世圣人易之以书契。"</i> —— 《周易·系辞下》</sub>
</p>
