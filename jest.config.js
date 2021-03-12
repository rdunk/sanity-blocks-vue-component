module.exports = {
  preset: 'ts-jest',
  collectCoverage: true,
  coverageDirectory: './coverage/',
  testEnvironment: 'jsdom',
  testRegex: '.*\\.test\\.tsx?$',
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
    '^.+\\.vue$': 'vue-jest',
  },
  watchPathIgnorePatterns: ['<rootDir>/node_modules/'],
};
