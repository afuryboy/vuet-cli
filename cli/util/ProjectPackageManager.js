const minimist = require('minimist')
const execa = require('execa')
const pkj = require('../../package.json')
const {hasYarn} = require('./env')
const PACKAGE_MANAGER_CONFIG = {
  npm: {
    install: ['install', '--loglevel', 'error'],
    add: ['install', '--loglevel', 'error'],
    upgrade: ['update', '--loglevel', 'error'],
    remove: ['uninstall', '--loglevel', 'error']
  },
  yarn: {
    install: [],
    add: ['add'],
    upgrade: ['upgrade'],
    remove: ['remove']
  }
}

class PackageManager {
  constructor ({ context, forcePackageManager } = {}) {
    this.context = context
    if (forcePackageManager) {
      this.bin = forcePackageManager
    } else {
      this.bin = (hasYarn() ? 'yarn' : 'npm')
    }
  }
  async getRegistry () {
    if (this._registry) {
      return this._registry
    }

    const args = minimist(process.argv, {
      alias: {
        r: 'registry'
      }
    })
    if (args.registry) {
      this._registry = args.registry
    } else {
      const { stdout } = await execa(this.bin, ['config', 'get', 'registry'])
      this._registry = stdout
    }
    return this._registry
  }
  async addRegistryToArgs (args) {
    const registry = await this.getRegistry()
    args.push(`--registry=${registry}`)
    return args
  }
  async install () {
    const args = await this.addRegistryToArgs(PACKAGE_MANAGER_CONFIG[this.bin].install)
    return this.executeCommand(this.bin, args, this.context)
  }
  executeCommand (command, args, cwd) {
    return new Promise((resolve, reject) => {
      const child = execa(command, args, {
        cwd,
        stdio: ['inherit','inherit', 'inherit']
      })
      child.on('close', code => {
        if (code !== 0) {
          reject(`command failed: ${command} ${args.join(' ')}`)
          return
        }
        resolve()
      })
    })
  }
  async getLatestVersion() {
    const args = await this.addRegistryToArgs(['info', 'vuet', '', '--json'])
    const { stdout } = await execa(this.bin, args)
    const version = JSON.parse(stdout).data.version
    return version
  }
}

module.exports = PackageManager