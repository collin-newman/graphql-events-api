// jest.config.js
// Sync object
/** @type {import('@jest/types').Config.InitialOptions} */
const config = {
  verbose: true,
  preset: "@shelf/jest-mongodb",
  testEnvironment: 'node',
};

module.exports = config;
