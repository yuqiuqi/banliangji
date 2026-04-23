# Phase 9: iOS 26 全局 Chrome — Context

**Gathered:** 2026-04-22  
**Status:** Ready for planning  
**Source:** ROADMAP Phase 9 + `09-BREAKTHROUGH-SPEC.md` + `REQUIREMENTS.md` v2.2

<domain>

## Phase Boundary

在 **不新增业务功能** 的前提下，将 半两记 **全部现有屏与共享组件** 的 UI/UX 统一为 **iOS / iPadOS 26 + Liquid Glass** 取向；验收以 `09-VERIFICATION.md` 全表 + `npm run verify` 为准。Dark Mode 为 **follow-up**（本阶段默认仅 Light 达标）。

</domain>

<decisions>

## Implementation Decisions（锁定）

- **D9-01** 主视觉来源由 v2.1 Tesla 切换为 **iOS 26 语义色与材质**；阶段结束时更新根 `DESIGN.md` 与 `PROJECT.md` 声明。
- **D9-02** 材质实现：**iOS** 优先 `expo-blur`；**Android** 允许降级为 **不透明近似色**（须在 `09-VERIFICATION` 标注平台）。
- **D9-03** 列表形态：以 **grouped inset**（白卡片于 `#F2F2F7` 底 + 行 hairline）为默认，不要求 RN 实现真·连续圆角每行独立。
- **D9-04** 共享原语集中在 `src/components/ios/`（或项目约定目录），业务屏 **组合原语** 而非复制样式。
- **D9-05** Figma 1:1：**可选增强**；MCP 可用时对齐 `node-id`，不可用则按 `09-UI-SPEC` + Apple HIG 验收。
- **D9-06** iPad：**Wave 1** 为 `maxWidth` + 水平居中 + 安全区；**split 分栏** 可记为 Phase 9 内第二步或 defer（在 VERIFICATION 写明）。

### Claude's Discretion

- 原语文件命名（`IOS*` vs `Apple*`）以可读为准。  
- 图表动效具体时长在现有 `chartFadeMs` 上微调即可。

</decisions>

<canonical_refs>

## Canonical References

- `.planning/phases/09-ios26-chrome/09-BREAKTHROUGH-SPEC.md` — 全屏幕 UI/UX 矩阵（§3）
- `.planning/phases/09-ios26-chrome/09-UI-SPEC.md` — 视觉与交互合同
- `.planning/REQUIREMENTS.md` — IOS26-CHROME / UX / COMP / IPAD / VERIFY
- `src/theme/colors.ts`, `src/theme/layout.ts`, `src/navigation/RootNavigator.tsx`

</canonical_refs>

---

*Phase: 09-ios26-chrome*
