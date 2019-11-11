
const EventEmitter = require('events')
const {hasYarn,clearConsole} = require('../util')
const PackageManager = require('../util/ProjectPackageManager')
const {logWithSpinner,stopSpinner} = require('../util')
const chalk = require('chalk')
const inquirer = require('inquirer')
const Generator = require('./generator')
const writeFileTree = require('../util/writeFileTree')
const validateProjectName = require('validate-npm-package-name')
module.exports = class Creator extends EventEmitter {
  constructor (name, context, promptModules) {
    super()
    this.name = name
    this.context = context
  }
  async create(cliOptions={}) {
    const { context, name } = this
    const packageManager = (
      (hasYarn() ? 'yarn' : 'npm')
    )
    const pm = new PackageManager({ context, forcePackageManager: packageManager })
    // 初始化选项
    const answers = await this.initPrompt()
    // 初始化模版
    const pkg = {
      name,
      version: '0.1.0',
      private: true
    }
    const generator = new Generator(context,{
      pkg
    })
    // common
    await require('../plugin-common/generator')(generator,answers)
    // 判断工程是否是单个模式还是多项目模式,生成目录结构
    if (answers.projectMode === 'multi') {
      await require('../plugin-multi-project/generator')(generator,answers)
    }
    // 往项目结构里填充文件
    await require('../plugin-add-app/generator')(generator,answers)

    // 创建package.json
    await writeFileTree(context, {
      'package.json': JSON.stringify(Object.assign(generator.pkg), null, 2)
    })
    // 写入文件
    await writeFileTree(context, generator.files)

    await clearConsole()
    logWithSpinner(`✨`, `Creating project in ${chalk.yellow(context)}.`)
    stopSpinner()
    // 下载
    await pm.install()
    
    stopSpinner()
    console.log(`🎉  Successfully created project ${chalk.yellow(name)}.`)
    console.log(
      `👉  Get started with the following commands:\n\n` +
      (this.context === process.cwd() ? `` : chalk.cyan(` ${chalk.gray('$')} cd ${name}\n`)) +
      (answers.projectMode === 'multi' ?  chalk.cyan(` ${chalk.gray('$')} ${packageManager === 'yarn' ? 'yarn dev:projectName' : 'npm run dev:projectName'}`) :
      chalk.cyan(` ${chalk.gray('$')} ${packageManager === 'yarn' ? 'yarn dev' : 'npm run dev'}`))
    )
    console.log()
    process.exit(0)
  }
  async initPrompt () {
    const projectMode = {
      name: 'projectMode',
      type: 'list',
      message: `Please pick a project model:`,
      choices: [
        {
          name: 'Single Project',
          value: 'single'
        },
        {
          name: 'Multi Project',
          value: 'multi'
        }
      ]
    }
    const multiProject = [
      {
        type: 'input',
        name: 'multiProject',
        message: "Please enter the name of multiple project",
        validate: function(value) {
          var pass = value.split(',').every((item) => {
            let result = validateProjectName(item)
            return result.validForNewPackages
          })
          if (pass) {
            return true;
          }
          return 'Please enter the project name separated by comma(example: project1,project2,...) and check your every project name is legal';
        }
      }
    ]
    const useTs = [
      {
        name: 'useTs',
        type: 'list',
        message: `Please choose whether you need to support typescript`,
        choices: [
          {
            name: 'Yes',
            value: true
          },
          {
            name: 'No',
            value: false
          }
        ]
      }
    ]
    var answers1 = await inquirer.prompt(projectMode)
    
    if (answers1.projectMode === 'multi') var answers2 = await inquirer.prompt(multiProject)
    if(answers2) {
      answers2.multiProject = answers2.multiProject.split(',')
    }
    var answers3 = await inquirer.prompt(useTs)
    return Object.assign({},answers1,answers2,answers3)
  }
}