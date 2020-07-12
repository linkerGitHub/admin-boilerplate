const path = require('path')
module.exports = {
  configureWebpack: {
    externals: {
      ClassicEditor: 'window.ClassicEditor',
      idxConfig: 'IdxConfig',
      idxConfigOnline: 'IdxConfigOnline',
      idxConfigMainland: 'IdxConfigMainland',
    }
  },

  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'less',
      patterns: [
        path.resolve(__dirname, './src/style/style-var-predefine.less'),
      ]
    }
  },

  publicPath: ''
}
