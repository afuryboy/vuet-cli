const path = require('path');
const isPortReachable = require('is-port-reachable');

function resolve(dir) {
  return path.join(__dirname, '..', dir);
}
function assetsPath(_path) {
  const assetsSubDirectory = 'static'

  return path.posix.join(assetsSubDirectory, _path)
}

async function checkPort(port) {
  let reachable = await isPortReachable(port)
  if (reachable) {
    //console.log(`端口: ${port}被占`);
    port++
    return await checkPort(port)
  } else {
    //console.log(`端口: ${port}可以使用`);
    return port
  }
}

module.exports = {
  resolve,
  assetsPath,
  checkPort
}
