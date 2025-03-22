"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testMatch: ['**/*.test.ts'],
    moduleFileExtensions: ['ts', 'js', 'json'],
    roots: ['<rootDir>'],
    transform: {
        '^.+\\.ts$': 'ts-jest',
    },
};
exports.default = config;
