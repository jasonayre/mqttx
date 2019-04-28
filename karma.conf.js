module.exports = (config) => {
  config.set({
    // ... normal karma configuration
    frameworks: ['jasmine'],
    files: [
      // all files ending in "_spec"
      { pattern: 'spec/*_spec.js', watched: false },
      { pattern: 'spec/**/*_spec.js', watched: false }
      // each file acts as entry point for the webpack configuration
    ],

    preprocessors: {
      // add webpack as preprocessor
      'spec/*_spec.js': [ 'webpack' ],
      'spec/**/*_spec.js': [ 'webpack' ]
    },

    webpack: {
      // karma watches the spec entry points
      // (you don't need to specify the entry option)
      // webpack watches dependencies

      // webpack configuration
    },

    webpackMiddleware: {
      // webpack-dev-middleware configuration
      // i. e.
      stats: 'errors-only'
    }
  })
}
