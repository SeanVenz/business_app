// webpack.config.js
module.exports = {
    // ...other config settings...
    resolve: {
      fallback: {
        "crypto": require.resolve("crypto-browserify"),
        "stream": require.resolve("stream-browserify"),
        "http": require.resolve("stream-http"),
        "https": require.resolve("https-browserify"),
        "zlib": require.resolve("browserify-zlib"),
        "buffer": require.resolve("buffer/"),
        // add other polyfills as necessary
      },
    },
    plugins: [
        // ...other plugins
        new webpack.ProvidePlugin({
          Buffer: ['buffer', 'Buffer'],
          process: 'process/browser',
        }),
        // ...other plugins
      ],
  };
  