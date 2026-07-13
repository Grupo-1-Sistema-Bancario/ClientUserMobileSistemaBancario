//Herramienta que poder intentar corre rn IOS.(No es necesario)
const { getDefaultConfig } = require("expo/metro-config");

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

module.exports = config;
