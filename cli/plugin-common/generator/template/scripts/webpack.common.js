const webpack = require('webpack')
const { VueLoaderPlugin } = require('vue-loader')
const util = require('./util')
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const ProgressBarPlugin = require('progress-bar-webpack-plugin')
const path = require('path')

module.exports = {
    module: {
      rules: [
        {
          test: /\.m?js$/,
          exclude: /(node_modules|bower_components)/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env']
            }
          }
        },
        <%if(useTs){%>
        {
          test: /\.tsx?$/,
          loader: 'ts-loader',
          exclude: /node_modules/,
          options: {
            appendTsSuffixTo: [/\.vue$/],
          }
        },
        <%}-%>
        {
          test: /\.vue$/,
          loader: 'vue-loader'
        },
        {
          test: /\.scss$/,
          loaders: [
              'css-hot-loader',
              {
                loader: MiniCssExtractPlugin.loader,
                options: {
                  publicPath: '../../'
                }
              },
              {
                loader: path.resolve(__dirname, './loaders/px2vw-loader.js'),
                options: {
                  viewportWidth: 1920,
                  minPixelValue: 1,
                  decimal: 4
                }
              },
              {
                  loader: 'css-loader',
                  options: {
                      sourceMap: true
                  },
              },
              {
                loader: 'postcss-loader',
                options: {
                  ident: 'postcss',
                  plugins: [
                    require('autoprefixer')({
                      broswers: ['last 5 versions']
                    }),
                  ]
                }
              },
              {
                  loader: 'sass-loader',
                  options: {
                      sourceMap: true,
                  },
              },
          ]
        },
        {
          test: /\.css$/,
          loaders: [
              'css-hot-loader',
              {
                loader: MiniCssExtractPlugin.loader,
                options: {
                  publicPath: '../../'
                }
              },
              {
                loader: path.resolve(__dirname, './loaders/px2vw-loader.js'),
                options: {
                  viewportWidth: 1920,
                  minPixelValue: 1,
                  decimal: 4
                }
              },
              {
                  loader: 'css-loader',
                  options: {
                      sourceMap: true
                  },
              },
              {
                loader: 'postcss-loader',
                options: {
                  ident: 'postcss',
                  plugins: [
                    require('autoprefixer')({
                      broswers: ['last 5 versions']
                    }),
                  ]
                }
              }
          ]
        },
        {
          test: /\.less$/,
          loaders: [
              'css-hot-loader',
              {
                loader: MiniCssExtractPlugin.loader,
                options: {
                  publicPath: '../../'
                }
              },
              {
                loader: path.resolve(__dirname, './loaders/px2vw-loader.js'),
                options: {
                  viewportWidth: 1920,
                  minPixelValue: 1,
                  decimal: 4
                }
              },
              {
                  loader: 'css-loader',
                  options: {
                      sourceMap: true
                  },
              },
              {
                loader: 'postcss-loader',
                options: {
                  ident: 'postcss',
                  plugins: [
                    require('autoprefixer')({
                      broswers: ['last 5 versions']
                    }),
                  ]
                }
              },
              {
                loader: 'less-loader',
                options: {
                    sourceMap: true,
                },
              },
          ]
        },
        {
          test: /\.styl(us)?$/,
          loaders: [
              'css-hot-loader',
              {
                loader: MiniCssExtractPlugin.loader,
                options: {
                  publicPath: '../../'
                }
              },
              {
                loader: path.resolve(__dirname, './loaders/px2vw-loader.js'),
                options: {
                  viewportWidth: 1920,
                  minPixelValue: 1,
                  decimal: 4
                }
              },
              {
                  loader: 'css-loader',
                  options: {
                      sourceMap: true
                  },
              },
              {
                loader: 'postcss-loader',
                options: {
                  ident: 'postcss',
                  plugins: [
                    require('autoprefixer')({
                      broswers: ['last 5 versions']
                    }),
                  ]
                }
              },
              {
                loader: 'stylus-loader',
                options: {
                    sourceMap: true,
                },
              },
          ]
        },
        {
          test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
          loader: 'url-loader',
          options: {
            limit: 10000,
            name: util.assetsPath('img/[name].[hash:7].[ext]'),
          }
        },
        {
          test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
          loader: 'url-loader',
          options: {
            limit: 10000,
            name: util.assetsPath('media/[name].[hash:7].[ext]'),
          }
        },
        {
          test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
          loader: 'url-loader',
          options: {
            limit: 10000,
            name: util.assetsPath('fonts/[name].[hash:7].[ext]'),
          }
        }
      ]
    },
    resolve: {
      extensions: [<% if(useTs) {%>'.ts',<%}%> '.js', '.vue', '.json'],
      alias: {
          vue: 'vue/dist/vue.esm.js',
          '@': util.resolve('src'),
          static: util.resolve('public/static')
      }
    },
    plugins: [
      // new webpack.ProgressPlugin({
      //   entries: true,
      //   modules: true,
      //   modulesCount: 100,
      //   profile: true,
      //   handler: (percentage, message, ...args) => {
      //     // custom logic

      //   }
      // }),
      // new Px2vwPlugin(),
      new ProgressBarPlugin(),
      new MiniCssExtractPlugin({
        // Options similar to the same options in webpackOptions.output
        // both options are optional
        filename: util.assetsPath('css/[name].css'),
        chunkFilename: util.assetsPath("css/[id].css")
      }), // 提取css 插入
      new webpack.optimize.ModuleConcatenationPlugin(), // 优化： 提高代码执行速度 ； https://www.webpackjs.com/plugins/module-concatenation-plugin/
      new VueLoaderPlugin()
    ],
}
