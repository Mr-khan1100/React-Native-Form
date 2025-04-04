module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        alias: {
          '@components': './src/components',
          '@assets': './src/assets/Images',
          '@utils': './src/utils',
          '@constants': './src/constants',
          '@redux': './src/redux',
          '@services': './src/services',
          '@context': './src/context',
        },
      },
    ],
  ],
};
