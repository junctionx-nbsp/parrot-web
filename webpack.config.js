const webpack = require("webpack")
const { dirname, basename, join } = require("path")
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { publicFolder } = require("./config")
const Dotenv = require("dotenv-webpack")

const isProduction = process.env.NODE_ENV === "production"

const prodPlugins = [
  new webpack.DefinePlugin({
    "process.env.NODE_ENV": JSON.stringify("production")
  }),

  new MiniCssExtractPlugin({
    // Options similar to the same options in webpackOptions.output
    // both options are optional
    filename: "[name].css",
    chunkFilename: "[id].css",
  })
]

const config = (entry, outfile, node = false) => {
  return {
    entry,
    output: {
      path: join(__dirname, dirname(outfile)),
      filename: basename(outfile)
    },
    mode: isProduction ? "production" : "development",
    target: node ? "node" : "web",
    module: {
      rules: [{
        test: /\.tsx?$/,
        loader: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          isProduction ? MiniCssExtractPlugin.loader : "style-loader",
          "css-loader",
          "sass-loader"
        ]
      }],
    },
    resolve: {
      extensions: [".tsx", ".ts", ".js", ".css", ".scss", ".sass"],
      // Comment this in if preact-compat is necessary
      /*"alias": {
        "react": "preact-compat",
        "react-dom": "preact-compat"
      }*/
    },
    plugins: [
      new Dotenv({ path: "./.env", systemvars: false }),
      ...(isProduction ? prodPlugins : []),
    ]
  }
}

module.exports = [
  config("./src/index.tsx", publicFolder + "/bundle.js")
]
