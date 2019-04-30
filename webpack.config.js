const nodeExternals = require('webpack-node-externals');
module.exports = {
  module: {
    rules: [
      { parser: { amd: false } }
    ],
  },
  resolve: {
  },
  externals: [
    nodeExternals(),
    {
      lodash : {
        commonjs: 'lodash',
        amd: 'lodash',
        root: 'mqttxlodash' // indicates global variable
      }
    }
  ],
  output: {
    library: 'mqttx',
    libraryTarget: 'umd',
    filename: 'index.js',
    path: __dirname,
    globalObject: '(this)'
  },


};
