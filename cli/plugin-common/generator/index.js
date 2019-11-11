module.exports = async(api, answers = {}) => {
  api.extendPackage({
    dependencies: {
      "@babel/polyfill": "^7.7.0",
      "vue": "^2.6.10"
    },
    devDependencies: {
      "@babel/core": "^7.5.5",
      "@babel/preset-env": "^7.5.5",
      "@babel/preset-typescript": "^7.7.2",
      "autoprefixer": "^9.6.1",
      "babel-loader": "^8.0.6",
      "clean-webpack-plugin": "^3.0.0",
      "copy-webpack-plugin": "^5.0.4",
      "css": "^2.2.4",
      "css-hot-loader": "^1.4.4",
      "css-loader": "^3.2.0",
      "file-loader": "^4.2.0",
      "friendly-errors-webpack-plugin": "^1.7.0",
      "html-webpack-plugin": "^3.2.0",
      "imagemin-webpack-plugin": "^2.4.2",
      "is-port-reachable": "^2.0.1",
      "less": "^3.10.3",
      "less-loader": "^5.0.0",
      "loader-utils": "^1.2.3",
      "mini-css-extract-plugin": "^0.8.0",
      "node-sass": "^4.12.0",
      "optimize-css-assets-webpack-plugin": "^5.0.3",
      "postcss-loader": "^3.0.0",
      "progress-bar-webpack-plugin": "^1.12.1",
      "sass-loader": "^8.0.0",
      "schema-utils": "^2.1.0",
      "stylus": "^0.54.7",
      "stylus-loader": "^3.0.2",
      "ts-loader": "^6.2.1",
      "typescript": "^3.7.2",
      "uglifyjs-webpack-plugin": "^2.2.0",
      "url-loader": "^2.1.0",
      "vue-loader": "^15.7.1",
      "vue-style-loader": "^4.1.2",
      "vue-template-compiler": "^2.6.10",
      "webpack": "^4.39.3",
      "webpack-cli": "^3.3.7",
      "webpack-dev-server": "^3.8.0",
      "webpack-merge": "^4.2.2"
    },
    peerDependencies: {
      "vue-template-compiler": "^2.6.10"
    }
  })
  await api.render('./template',{
    useTs: answers.useTs,
    singleProject: answers.projectMode === 'single',
    escapeEjs: ['public/index.html']
  })
}
