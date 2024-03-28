// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);
const path = require('path');
const root = path.resolve(__dirname, '..');
const pak = require('../package.json');

const modules = Object.keys({
  ...pak.peerDependencies,
});

const escape = require('escape-string-regexp');
const exclusionList = require('metro-config/src/defaults/exclusionList');

config.transformer = {
  ...config.transformer,
  babelTransformerPath: require.resolve('react-native-svg-transformer'),
  assetPlugins: ['expo-asset/tools/hashAssetFiles'],
  getTransformOptions: async () => ({
    transform: {
      experimentalImportSupport: false,
      inlineRequires: true,
    },
  }),
};
//

// extraNodeModules: modules.reduce((acc, name) => {
//   acc[name] = path.join(__dirname, 'node_modules', name);
//   return acc;
// }, {}),

config.resolver = {
  ...config.resolver,
  assetExts: config.resolver.assetExts.filter((ext) => ext !== 'svg'),
  sourceExts: [...config.resolver.sourceExts, 'svg', 'd.ts'],
  blacklistRE: exclusionList(
    modules.map(
      (m) => new RegExp(`^${escape(path.join(root, 'node_modules', m))}\\/.*$`)
    )
  ),
  extraNodeModules: {
    ...modules.reduce((acc, name) => {
      acc[name] = path.join(__dirname, 'node_modules', name);
      return acc;
    }, {}),
    'react-native-maui': path.resolve('../src'),
  },
};

config.projectRoot = __dirname;
config.watchFolders = [root];

module.exports = config;
