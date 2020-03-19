const Webpack = require('webpack');
const Autoprefixer = require('autoprefixer');
const StyleLintPlugin = require('stylelint-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const nodeExternals = require('webpack-node-externals');
const NodemonPlugin = require('nodemon-webpack-plugin');

module.exports = {
  mode: 'development',
  devServer: {
    // webpack-dev-serverの公開フォルダ
    contentBase: `${__dirname}/public`,
    historyApiFallback: true
  },
  // モジュールバンドルを行う起点となるファイルの指定
  // 指定できる値としては、ファイル名の文字列や、それを並べた配列やオブジェクト
  // 下記はオブジェクトとして指定した例
  entry: {
    app: ['./client/index.tsx'],
  },
  devtool: 'inline-source-map',
  output: {
    // モジュールバンドルを行った結果を出力する場所やファイル名の指定
    // "__dirname"はこのファイルが存在するディレクトリを表すnode.jsで定義済みの定数
    path: `${__dirname}/public`,
    publicPath: '/',
    filename: '[name].js', // [name]はentryで記述した名前(この例ではbundle）が入る
  },
  // モジュールとして扱いたいファイルの拡張子を指定する
  // 例えば「import Foo from './foo'」という記述に対して"foo.ts"という名前のファイルをモジュールとして探す
  // デフォルトは['.js', '.json']
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx", ".css"],
  },
  // モジュールに適用するルールの設定（ここではローダーの設定を行う事が多い）
  module: {
    rules: [

      {
        enforce: 'pre',
        test: /\.tsx?$/,
        exclude: /node_modules/,
        loader: 'eslint-loader',
        options: {
          fix: true,
        },
      },
      {
        // 拡張子が.tsで終わるファイルに対して、TypeScriptコンパイラを適用する
        test: /\.tsx$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'ts-loader',
          },
        ],
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              url: true,
              sourceMap: true,
              importLoaders: 2,
            },
          },
        ],
      },
      {
        test: /\.s?css$/,
        exclude: /node_modules/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              url: true,
              sourceMap: true,
              importLoaders: 2,
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: true,
              plugins: [
                new Autoprefixer({
                  grid: true,
                }),
              ],
            },
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
            },
          },
        ],
      },
      {
        test: /\.(gif|png|jpg|eot|wof|woff|woff2|ttf|svg)$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 100 * 1024, // 100KB以上だったら埋め込まずファイルとして分離する
              name: `./public/img/[hash].[ext]`,
            },
          },
        ],
      },
      {
        test: /\.html$/,
        loader: "html-loader"
      }
    ],
  },
  plugins: [
    new Webpack.ProvidePlugin({
      '$': 'jquery',
      'jQuery': 'jquery',
      'window.jQuery': 'jquery',
    }),
    new StyleLintPlugin({
      configFile: './.stylelintrc',
      syntax: 'scss',
      quiet: false,
      fix: true,
    }),
    new HtmlWebpackPlugin({
      template: "./client/src/html/index.html"
    })
  ],
};
