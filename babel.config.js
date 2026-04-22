module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    // Reanimated 4：`react-native-reanimated/plugin` 已在 v4 重导出为 `react-native-worklets/plugin`，
    // 两者同时出现会触发 Babel「Duplicate plugin/preset detected」。只保留一个即可（置于最后）。
    plugins: ["react-native-worklets/plugin"],
  };
};
