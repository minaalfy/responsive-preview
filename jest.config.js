module.exports = {
    verbose: true,
    testRegex: "(/(__tests__|tests)/.*|(\\.|/)(test|spec))\\.jsx?$",
    testPathIgnorePatterns: [
      "/node_modules/",
      "<rootDir>/tests/__mocks__/*"
    ],
    testURL: "http://localhost:8080",
    moduleFileExtensions: [
      "js",
      "jsx"
    ],
    moduleDirectories: [
      "node_modules"
    ],
    moduleNameMapper: {
      "^preact$": "<rootDir>/node_modules/preact/dist/preact.min.js"
    }
  };