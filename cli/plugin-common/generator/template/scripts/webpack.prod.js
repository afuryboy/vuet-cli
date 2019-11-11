const path = require('path');
const webpack = require('webpack')
const merge = require('webpack-merge')
const baseConfig = require('./webpack.common.js')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
// const ImageminPlugin = require('imagemin-webpack-plugin').default

const utils = require('./util')
module.exports = (env, argv) => {
  env = env || {}
  env = Object.assign({dist:'dist'},env)
  let config = merge(baseConfig, {
    mode: 'production',
    entry: ["@babel/polyfill", `./src<%if(!singleProject){%>/${env.project}<%}%>/main.<% if(useTs) {%>t<%}else{%>j<%}%>s`],
    output: {
      filename: utils.assetsPath('js/[name].js'),
      chunkFilename: utils.assetsPath('js/[id].js'),
      path: path.resolve(__dirname,`../${env.dist}<%if(!singleProject){%>/${env.project}<%}%>`),
    },
    module: {
      rules: []
    },
    optimization: {
      minimizer: [new OptimizeCSSAssetsPlugin({})]
    },
    resolve: {
      alias: {
        assets: utils.resolve(`src<%if(!singleProject){%>/${env.project}<%}%>/assets`)
      }
    },
    plugins: [
      new webpack.DefinePlugin({ "process.env.NODE_ENV": JSON.stringify(env.NODE_ENV||'production') }),
      new CleanWebpackPlugin(),
      // new ImageminPlugin({
      //   test: /\.(jpe?g|png|gif|svg)$/i,
      //   pngquant: {
      //     quality: '50-60'
      //   },
      //   optipng: {
      //     optimizationLevel: 6
      //   }
      // }),
      new UglifyJsPlugin({
        uglifyOptions: {
          compress: {
            drop_debugger: true,
            drop_console: true
          }
        }
      }),
      new HtmlWebpackPlugin({
          title: '',
          inject: true,
          filename: 'index.html',
          template: path.resolve(__dirname,'../public/index.html'),
          // chunks: ['main'],
          hash:true,
          // inlineSource: '.(js|css)$'
      }),
    ]
  })
  return config
}