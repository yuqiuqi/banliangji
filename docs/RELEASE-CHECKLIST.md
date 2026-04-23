# 发布检查清单（半两记）

**应用版本（须一致）：** `package.json` 的 `version` 与 `app.json` 的 `expo.version` — 当前均为 **1.0.0**。

## 发布前

- [ ] 本地执行 `npm run verify`（或通过 `bash scripts/verify.sh`）全部通过  
- [ ] 阅读 `README.md` 中的开发与质量说明  
- [ ] （若发商店）在 `app.json` 中核对 `name` / `slug` / 图标与启动屏资源  
- [ ] （若使用 EAS）已配置 `eas.json` 与 Apple/Google 凭证 — *本仓库未默认提交 EAS 配置时，此项为手动环境项*  
- [ ] （若侧载）Android：`npx expo run:android` 或构建 APK/AAB；iOS：Xcode 归档或 EAS Build  

## 对外说明

- [ ] 更新本文档或单独 `CHANGELOG.md` 中的**用户可见变更**（若版本号 bump）  
- [ ] `PROJECT.md` 中 Out of Scope / 数据驻留说明仍与构建一致  

## 签核

| 角色 | 日期 | 备注 |
|------|------|------|
| 维护者 | 2026-04-21 | Phase 4 自动化门禁已接入 |
