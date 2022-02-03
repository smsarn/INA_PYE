module.exports = {
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      }
    ]
  },
  optimization: {
    runtimeChunk: 'single',
    splitChunks: {
      chunks: 'all',
    }
  }
  externals: {
  'Config': JSON.stringify(process.env.NODE_ENV === 'production' ? {
    serverUrl: "https://myserver.com"
  } : {
    serverUrl: "http://localhost:8090"
  })
};