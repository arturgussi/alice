module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./'],
        extensions: [
          '.js',
          '.jsx',
          '.ts',
          '.tsx',
          '.android.js',
          '.android.tsx',
          '.ios.js',
          '.ios.tsx',
        ],
        alias: {
          '@assets': './assets',
          '@constants': './src/constants',
          '@components': './src/components',
          '@contexts': './src/contexts',
          '@routes': './src/routes',
          '@screens': './src/screens',
        },
      },
    ],
    'react-native-reanimated/plugin',
  ],
};
