const fs = require('fs-extra')
const path = require('path')
module.exports = async function createDir (context,dir) {
  fs.ensureDirSync(context+dir)
}
