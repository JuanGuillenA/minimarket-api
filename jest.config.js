/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
preset: 'ts-jest',
testEnvironment: 'node',
testMatch: ['**/__tests__/**/*.test.ts'],
coverageDirectory: 'coverage',
collectCoverageFrom: [
'src/controllers/**/*.ts',
'src/services/**/*.ts',
'src/routes/**/*.ts'
],
coveragePathIgnorePatterns: [
'/node_modules/',
'/dist/'
]
};