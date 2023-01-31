// 暂时没用，以备后用

module.exports = {
  sourceType: "unambiguous",
  presets: [
    [
      "@babel/preset-env",
      {
        useBuiltIns: "usage",
        corejs: 3,
      },
    ],
    [
      "@babel/preset-react",
      {
        runtime: "automatic",
      },
    ],
  ],
  plugins: [
    [
      "auto-import",
      {
        declarations: [
          {
            default: "React",
            path: "react",
          },
        ],
      },
    ],
    ["@babel/plugin-proposal-class-properties"],
    [
      "@babel/plugin-proposal-decorators",
      {
        legacy: true,
      },
    ],
    [
      "import",
      {
        libraryName: "jmtd",
        style: "css",
      },
      "jmtd",
    ],
    [
      "import",
      {
        libraryName: "jmtd-charts",
        style: "css",
      },
      "jmtd-charts",
    ],
    [
      "import",
      {
        libraryName: "jmtd-pro",
        style: "css",
      },
      "jmtd-pro",
    ],
  ],
};
