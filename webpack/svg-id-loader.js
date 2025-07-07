const SVGIdProcessor = require('../src/utils/svg-id-processor');

module.exports = function(source) {
  const options = this.getOptions() || {};
  const processor = new SVGIdProcessor(options);
  
  return processor.process(source);
};
