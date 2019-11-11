const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const merge = require('webpack-merge')
const baseConfig = require('./webpack.common.js')
const utils = require('./util')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')

module.exports = (env,argv) => {
  env = env || {}
  var port = env.port || 8081
  return new Promise((resolve,reject) => {
    utils.checkPort(port).then(port=>{
        let config = merge(baseConfig, {
          mode: 'development',
          devtool: 'eval-source-map',
          entry: ["@babel/polyfill", `./src<%if(!singleProject){%>/${env.project}<%}%>/main.<% if(useTs) {%>t<%}else{%>j<%}%>s`],
          output: {
            filename: utils.assetsPath('js/[name].js'),
            chunkFilename: utils.assetsPath('js/[id].js'),
          },
          devServer: {
            disableHostCheck: true,
            host: '0.0.0.0',
            port: port,
            publicPath: '/',
            noInfo: true,
            hot: true,
            overlay: {
              warnings: true,
              errors: true
            },
            open: true,
            // openPage: `?p=${proxyConfig.p}`,
            stats: 'none',
            // proxy: {
            //   '/': {
            //     target: proxyConfig.proxy,
            //     ws: false,
            //     changeOrigin: true,
            //   }
            // }
          },
          module: {
            rules: []
          },
          resolve: {
            alias: {
              assets: utils.resolve(`src<%if(!singleProject){%>/${env.project}<%}%>/assets`)
            }
          },
          plugins: [
            new webpack.DefinePlugin({
              'process.env.NODE_ENV': JSON.stringify(env.NODE_ENV||'development'),
            }),
            new webpack.HotModuleReplacementPlugin(),
            new HtmlWebpackPlugin({
                title: '',
                inject: true,
                filename: 'index.html', // filename的路径是相对于output.path的，而在webpack-dev-server中，则是相对于webpack-dev-server配置的publicPath
                template: path.resolve(__dirname,'../public/index.html'),
                hash: true
            }),
            new FriendlyErrorsPlugin({
              compilationSuccessInfo: {
                messages: [`You application is running here http://localhost:${port}`],
                notes: ['代码永无bug']
              },
            })
          ],
          optimization: { // 替代CommonsChunkPlugin
            splitChunks: {
              chunks: 'async',
              minSize: 30000,
              maxSize: 0,
              minChunks: 1,
              maxAsyncRequests: 5,
              maxInitialRequests: 3,
              automaticNameDelimiter: '~',
              name: true,
              cacheGroups: {
                vendors: {
                  test: /[\\/]node_modules[\\/]/,
                  priority: -10
                },
                default: {
                  minChunks: 2,
                  priority: -20,
                  reuseExistingChunk: true
                }
              }
            }
          }
      })
      resolve(config)
    })
  })
}