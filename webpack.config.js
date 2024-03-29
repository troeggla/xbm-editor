const rendererTarget = {
  entry: "./app/main.ts",
  mode: "development",
  target: "electron-renderer",
  output: {
    path: __dirname + "/bundle",
    filename: "renderer.js"
  },
  devtool: "source-map",
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx"]
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader"
      }, {
        test: /\.css$/,
        use: [
          "style-loader",
          "css-loader"
        ]
      }
    ]
  }
};

const preloadTarget = {
  entry: "./preload/main.ts",
  mode: "development",
  target: "electron-main",
  output: {
    path: __dirname + "/bundle",
    filename: "preload.js"
  },
  devtool: "source-map",
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx"]
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader"
      }
    ]
  },
  node: {
    __dirname: false
  }
}

const mainProcessTarget = {
  entry: "./main/main.ts",
  mode: "development",
  target: "electron-main",
  output: {
    path: __dirname + "/bundle",
    filename: "main.js"
  },
  devtool: "source-map",
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx"]
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader"
      }
    ]
  },
  node: {
    __dirname: false
  }
};

module.exports = [rendererTarget, preloadTarget, mainProcessTarget];
