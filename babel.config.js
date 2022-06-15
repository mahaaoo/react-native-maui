module.exports = function(api) {
  api.cache(true);
  return {
    presets: [
      'module:metro-react-native-babel-preset',
      [
        '@babel/preset-env',
        {
          targets: {node: 'current'},
          loose: true,
        }
      ],
      '@babel/preset-typescript',
    ],
    plugins: [
      'react-native-reanimated/plugin'
    ],
  };
};
