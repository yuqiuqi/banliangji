module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    // Reanimated 4：worklets 为独立原生模块；`react-native-worklets/plugin` 须置于最后（官方文档）。
    plugins: ["react-native-reanimated/plugin", "react-native-worklets/plugin"],
  };
};
