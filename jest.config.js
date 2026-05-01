module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  // On s'assure que Jest cherche bien dans le dossier server/src
  testMatch: ["<rootDir>/server/src/**/*.test.ts"],
};