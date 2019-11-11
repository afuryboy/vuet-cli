const fs = require('fs-extra')
const path = require('path')
const reg = /^[\s\S]*.png$/
module.exports = async function writeFileTree (dir, files, previousFiles) {
  if (previousFiles) {
    await deleteRemovedFiles(dir, files, previousFiles)
  }
  Object.keys(files).forEach((name) => {
    let imgFlag = false
    if (reg.test(name)) {
      imgFlag = true
    }
    const filePath = path.join(dir, name)
    fs.ensureDirSync(path.dirname(filePath))
    fs.writeFileSync(filePath, files[name], imgFlag ? 'binary' : 'utf-8')
  })
}
