module.exports = async(api, answers = {}) => {
  var scripts = {}
  if (answers.projectMode === 'single') {
    let singleConfig = {
      "dev": "webpack-dev-server --config scripts/webpack.dev.js",
      "test": "webpack --env.NODE_ENV=test --config scripts/webpack.prod.js",
      "build": "webpack --config scripts/webpack.prod.js"
    }
    scripts = Object.assign(scripts,singleConfig)
  } else {
    let multiConfig = {}
    answers.multiProject.map(item => {
      multiConfig["dev:"+item] = "webpack-dev-server --env.project="+item+" --config scripts/webpack.dev.js"
      multiConfig["test:"+item] = "webpack --env.project="+item+" --env.NODE_ENV=test --config scripts/webpack.prod.js"
      multiConfig["build:"+item] = "webpack --env.project="+item+" --config scripts/webpack.prod.js"
    })
    scripts = Object.assign(scripts,multiConfig)
  }
  api.extendPackage({
    "scripts": scripts
  })
  await api.render('./template',{
    useTs: answers.useTs,
    singleProject: answers.projectMode === 'single',
    addon: true,
    pathRender: function(path,replace) {
      if (path === 'src/main') {
        answers.useTs ? path = 'src/main.ts' : path = 'src/main.js'
      }
      if (replace) {
        return path.replace('/', `/${replace}/`)
      } else {
        return path
      }
    },
    exclude: function(path) {
      let exclude = ['tsconfig.json','src/vue.shims.d.ts']
      if(!answers.useTs && exclude.includes(path)) return true
      else return false
    }
  })
}