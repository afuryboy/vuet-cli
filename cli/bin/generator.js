const ejs = require('ejs')
const path = require('path')
const fs = require('fs-extra')
const sortObject = require('../util/sortObject')
const createDir = require('../util/createDir')
class Generator {
  constructor(context, {
    pkg = {},
  } = {}) {
    this.context = context
    this.originalPkg = pkg
    this.pkg = {}
    this.files = {}
    this.structure = []
  }
  extendPackage(pkg) {
    this.pkg = Object.assign({},this.pkg,this.originalPkg,pkg)
  }
  async generatorProject(answers) {
    answers.multiProject.map(item => {
      this.structure.push(`${item}`)
    })
  }
  async render(source,data={},ejsOptions={}) {
    var baseDir = this.extractCallDir()
    var source = path.resolve(baseDir, source)
    const globby = require('globby')
    const _files = await globby(['**/*'], { cwd: source })
    for (let rawPath of _files) {
      const targetPath = rawPath.split('/').map(filename => {
        if (filename.charAt(0) === '_' && filename.charAt(1) !== '_') {
          return `.${filename.slice(1)}`
        }
        if (filename.charAt(0) === '_' && filename.charAt(1) === '_') {
          return `${filename.slice(1)}`
        }
        return filename
      }).join('/')
      const sourcePath = path.resolve(source, rawPath)
      const content = this.renderFile(sourcePath,rawPath, data, ejsOptions)
      
      if(data.exclude && data.exclude(rawPath)) {
        continue
      }
      if (Buffer.isBuffer(content) || /[^\s]/.test(content)) {
        // 写入
        if (data.addon && this.structure.length>0) {
          this.structure.map(item => {
            var rawPathClone = data.pathRender(rawPath,item)
            this.files[rawPathClone] = content
          })
        } else {
          var rawPathClone = (data.pathRender && data.pathRender(rawPath)) || rawPath
          this.files[rawPathClone] = content
        }
      }
    }
  }
  extractCallDir() {
    // extract api.render() callsite file location using error stack
    const obj = {}
    Error.captureStackTrace(obj)
    const callSite = obj.stack.split('\n')[3]
    const fileName = callSite.match(/\s\((.*):\d+:\d+\)$/)[1]
    return path.dirname(fileName)
  }
  renderFile (name, rawPath,data, ejsOptions) {
    let reg = /^[\s\S]*.png$/g
    let finalTemplate
    if (data.escapeEjs && data.escapeEjs.includes(rawPath) || reg.test(rawPath)) {
      finalTemplate = fs.readFileSync(name, 'binary')
      return finalTemplate
    } else {
      finalTemplate = fs.readFileSync(name, 'utf-8')
    }
    return ejs.render(finalTemplate, data, ejsOptions)
  }
  sortPkg () {
    // ensure package.json keys has readable order
    this.pkg.dependencies = sortObject(this.pkg.dependencies)
    this.pkg.devDependencies = sortObject(this.pkg.devDependencies)
    this.pkg.scripts = sortObject(this.pkg.scripts, [
      'serve',
      'build',
      'test',
      'e2e',
      'lint',
      'deploy'
    ])
    this.pkg = sortObject(this.pkg, [
      'name',
      'version',
      'private',
      'description',
      'author',
      'scripts',
      'main',
      'module',
      'browser',
      'jsDelivr',
      'unpkg',
      'files',
      'dependencies',
      'devDependencies',
      'peerDependencies',
      'vue',
      'babel',
      'eslintConfig',
      'prettier',
      'postcss',
      'browserslist',
      'jest'
    ])

    // debug('vue:cli-pkg')(this.pkg)
  }
}

module.exports = Generator