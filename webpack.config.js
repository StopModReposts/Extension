const path = require("path");

module.exports = {
  entry: {
    background: "./src/background.ts",
    alert: "./src/ui/alert.ts",
  },
  devtool: "source-map",
  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "out"),
  },
};
