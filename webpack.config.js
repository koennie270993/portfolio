const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  entry: './src/browserIndex.ts',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'js'),
    clean: true, // Clear the output directory before each build
  },
  // Only generate source maps in development mode
  devtool: process.env.NODE_ENV === 'production' ? false : 'source-map',
  // Configure optimization to ensure license comments are extracted
  optimization: {
    minimize: process.env.NODE_ENV === 'production',
    minimizer: [
      new TerserPlugin({
        extractComments: true,
        terserOptions: {
          format: {
            comments: /@license|@preserve|Copyright|license|License/i,
          },
        },
      }),
    ],
  },
}; 