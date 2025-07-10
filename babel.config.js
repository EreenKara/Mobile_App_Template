module.exports = function (api) {
   api.cache(true);
   return {
      presets: [['babel-preset-expo', { jsxImportSource: 'nativewind' }], 'nativewind/babel'],
      plugins: [
         'react-native-reanimated/plugin', // Reanimated plugin en sonda olmalı!
         [
            'module-resolver',
            {
               root: ['./src'],
               extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
               alias: {
                  '@mycomponents': './MyComponents',
                  '@screens': './src/screens',
                  '@assets': './assets',
                  '@services': './src/services',
                  '@navigation': './src/navigation',
                  '@styles': './styles',
                  '@utility': './src/utility',
                  '@shared': './src/shared',
                  '@apptypes': './src/types',
                  '@components': './src/components',
                  '@contexts': './src/contexts',
                  '@hooks': './src/hooks',
                  '@scripts': './scripts',
               },
            },
         ],
      ],
   };
};
