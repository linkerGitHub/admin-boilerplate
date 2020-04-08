module.exports = {
  configureWebpack: {
    externals: {
      ClassicEditor: 'window.ClassicEditor',
      externalConfig: 'externalConfig'
    }
  }
}
