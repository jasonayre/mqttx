const nodeExternals = require('webpack-node-externals');
const MainBuild = {
  module: {
    rules: [
      { parser: { amd: false } }
    ],
  },
  resolve: {
  },
  externals: [
    nodeExternals({allowlist: [/^lodash/]})
  ],
  output: {
    library: 'mqttx',
    libraryTarget: 'umd',
    filename: 'index.js',
    path: __dirname,
    globalObject: '(this)'
  }
};

const Es6Build =  {
  module: {
    rules: [
      { parser: { amd: false } }
    ]
  },
  resolve: {
  },
  externals: [
    nodeExternals({allowlist: [/^lodash/]})
  ],
  output: {
    library: 'mqttx',
    libraryTarget: 'amd',
    filename: 'mqttx.js',
    path: __dirname + '/dist',
    // globalObject: '(this)'
  }
};

const Builds = [MainBuild, Es6Build]

module.exports = [...Builds];
