module.exports = {
   presets: ['babel-preset-expo'],
   plugins: [
      'react-native-reanimated/plugin',
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
               '@types': './src/types',
               '@components': './src/components',
               '@contexts': './src/contexts',
               '@hooks': './src/hooks',
               '@scripts': './scripts',
            },
         },
      ],
   ],
};
