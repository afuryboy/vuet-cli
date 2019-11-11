[
  'env',
  'cleanArgs',
  'spinner',
  'clearConsole',
].forEach(m => {
  Object.assign(exports, require(`./${m}`))
})
