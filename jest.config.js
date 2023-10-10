/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
    roots: ['<rootDir>/src/test'],
    preset: 'ts-jest',
    testEnvironment: 'node',
    collectCoverage: true,
    coverageDirectory: 'coverage',
    testPathIgnorePatterns: [
        "/node_modules/"
    ],
    verbose: true,
    coverageThreshold: {
        global: {
            branches: 100,
            functions: 100,
            lines: 100,
            statements: 100
        }
    },
    setupFilesAfterEnv: ['<rootDir>/src/test/Setup.ts']
};