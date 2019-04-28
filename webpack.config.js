const nodeExternals = require('webpack-node-externals');
module.exports = {
  // entry: './index.js'
  output: {
    library: 'mqttx',
    libraryTarget: 'umd',
    filename: 'index.js',
    path: __dirname,
    globalObject: '(this)'
  },
  externals: [nodeExternals()]
};
