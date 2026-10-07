module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    // Plugin reanimated PHẢI ở cuối cùng
    'react-native-reanimated/plugin',
  ],
};
