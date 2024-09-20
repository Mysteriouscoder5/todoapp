module.exports = {
  preset: 'react-native',
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation)',
  ],
  collectCoverage: true,
  setupFilesAfterEnv: ['./jest.setup.js'],
};
