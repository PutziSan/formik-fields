module.exports = {
  setupTestFrameworkScriptFile: 'jest-enzyme',
  testEnvironment: 'enzyme',
  transform: {
    // https://github.com/kulshekhar/ts-jest#supports-synthetic-modules => for default-imports "esModuleInterop"-flag in tsconfig must set to true
    '^.+\\.tsx?$': 'ts-jest'
  },
  testRegex: '(/tests/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  testURL: 'http://localhost'
};
