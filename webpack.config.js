module.exports = {
  entry: "./src/FluxibleReactSelect.js",
  output: {
    path: __dirname + "/dist",
    filename: 'fluxible-react-select.js',
  },
  module: {
    loaders: [
      { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader"}
    ]
  }
}
