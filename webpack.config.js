const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    mode: 'development',
    entry: {
      app: './src/index.jsx'
    },
    output: {
      filename: '[name].bundle.js',
      path: path.resolve(__dirname, 'public')
    },
    devServer: {
      contentBase: './public',
      hot: true
    },
    resolve: {
      extensions: ['.js', '.jsx','.tsx','ts']
    },
    module : {
        rules : [
          {
            test: /\.tsx?$/,
            use: 'ts-loader',
            exclude: /node_modules/
          },
          {
            test : /\.jsx?/,
            include: /(@material|src)/,
            loader : 'babel-loader'
          },
          {
            test: /\.(png|jpg|gif|woff2)$/,
            loader: 'file-loader'
          },
          {
            test: /\.(css|less)$/,
            use: [ 'style-loader', 'css-loader','less-loader' ]
          }
        ]
      },
    devtool: 'inline-source-map',
    plugins: [
      new webpack.NamedModulesPlugin(),
      new HtmlWebpackPlugin({
        title: 'My App',
        filename: 'index.html'
      }),
      new webpack.HotModuleReplacementPlugin()
    ]
  };
