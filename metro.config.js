const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Adiciona suporte a GIFs como assets estáticos
config.resolver.assetExts.push('gif');

module.exports = config;
