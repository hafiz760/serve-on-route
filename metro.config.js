const { getDefaultConfig } = require('@react-native/metro-config');
const { wrapWithReanimatedMetroConfig } = require('react-native-reanimated/metro-config');

// Fetch default Metro configuration
const defaultConfig = getDefaultConfig(__dirname);

// Wrap the default config with Reanimated's wrapper
module.exports = wrapWithReanimatedMetroConfig(defaultConfig);
