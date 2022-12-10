module.exports = {
  configureWebpack: {
    devtool: 'source-map'
  },
  productionSourceMap: false,
  pluginOptions: {
    i18n: {
      enableInSFC: true
    }
  }
}
