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
          '@': './src',
          '@api': './src/api',
          '@assets': './src/assets',
          '@constants': './src/constants',
          '@components': './src/components',
          '@contexts': './src/contexts',
          '@hooks': './src/hooks',
          '@routes': './src/routes',
          '@screens': './src/screens',
          '@services': './src/services',
          '@util': './src/Util.ts',
        },
      },
    ],
    'react-native-reanimated/plugin',
    [
      'module:react-native-dotenv',
      {
        moduleName: '@env', // Nome do módulo para importar as variáveis
        path: '.env', // Caminho para o seu arquivo .env
        blacklist: null, // Nenhuma variável na lista negra
        whitelist: null, // Nenhuma variável na lista branca
        safe: false, // Não requer um arquivo .env.example
        allowUndefined: true, // Permite variáveis indefinidas (útil para diferentes ambientes)
      },
    ],
  ],
};
