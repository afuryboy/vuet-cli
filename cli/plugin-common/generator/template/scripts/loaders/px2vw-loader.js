const utils = require('loader-utils');
const validateOptions = require('schema-utils')

const schema = {
  type: 'object',
  properties: {
    viewportWidth: {
      type: 'number'
    },
    minPixelValue: {
      type: 'number'
    },
    decimal: {
      type: 'number'
    }
  }
}
module.exports = function(source) {
  var options = utils.getOptions(this);
  validateOptions(schema, options, 'px2vw-loader');
  if (!this.cacheable || !options) {
      return source;
  }
  this.cacheable();
  options = Object.assign({
    viewportWidth: 750,
    minPixelValue: 1,
    decimal: 4
  }, options)
  var matchPXExp = /([0-9.]+px)([;,| |}|'|"\)\r|\n])/g;
  return source.replace(matchPXExp, function(match, p1, p2) {
    var pixels = p1.replace(/[^0-9.]/ig, '')
    pixels = parseFloat(pixels)
    if (pixels <= options.minPixelValue) {
      return match;
    }
    return `${(pixels/options.viewportWidth*100).toFixed(options.decimal)}vw${p2}`
  });
}