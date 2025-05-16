export default {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/resources/ts/__tests__/mocks/fileMock.js',
    '^@/(.*)$': '<rootDir>/resources/ts/$1',
    '^@assets/(.*)$': '<rootDir>/resources/ts/assets/$1',
    '^@css/(.*)$': '<rootDir>/resources/css/$1',
    '^@schemas/(.*)$': '<rootDir>/resources/ts/schemas/$1',
  },
  setupFilesAfterEnv: ['<rootDir>/resources/ts/__tests__/setup.ts'],
  testMatch: ['<rootDir>/resources/ts/__tests__/**/*.test.{ts,tsx}'],
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', {
      tsconfig: 'tsconfig.json',
    }],
  },
  moduleDirectories: ['node_modules', 'resources/ts'],
  testPathIgnorePatterns: ['/node_modules/'],
  coveragePathIgnorePatterns: ['/node_modules/'],
};