const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Allow TensorFlow model weight files
config.resolver.assetExts.push('bin');
config.resolver.assetExts.push('json');

module.exports = config;