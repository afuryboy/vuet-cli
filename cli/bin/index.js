const program = require('commander')
const pkj = require('../../package.json')
const { cleanArgs } = require('../util')

program
  .version(pkj.version)
  .usage('<command> [options]')

// create
program
  .command('create <app-name>')
  .alias('c')
  .description('create a new project powered by vuet')
  .option('-f, --force', 'Overwrite target directory if it exists')
  .option('-r, --registry <url>', 'Use specified npm registry when installing dependencies (only for npm)')
  .action((name,cmd) => {
    let options = cleanArgs(cmd)
    require('./create')(name, options)
  })
program.parse(process.argv);