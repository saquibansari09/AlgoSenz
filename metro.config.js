// metro.config.js

// metro.config.js
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

config.resolver.assetExts.push('png'); // ✅ Ensure PNGs resolve properly

module.exports = config;
