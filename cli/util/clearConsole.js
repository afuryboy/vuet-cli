const chalk = require('chalk')
const PackageManager = require('./ProjectPackageManager')
const { clearConsole } = require('./logger')
const pkj = require('../../package.json')
const pm = new PackageManager()
exports.generateTitle = async function () {
  const { version } = pkj
  const latest = await pm.getLatestVersion()
  let title = chalk.bold.yellow(`Vuet CLI v${version}`)
  title += chalk.green(`
┌────────────────────${`─`.repeat(latest.length)}──┐
│  Update available: ${latest}  │
└────────────────────${`─`.repeat(latest.length)}──┘`)
  return title
}

exports.clearConsole = async function clearConsoleWithTitle () {
  const title = await exports.generateTitle()
  console.log(title);
  clearConsole(title)
}
