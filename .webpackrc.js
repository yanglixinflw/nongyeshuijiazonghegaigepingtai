const path = require('path');
export default {
  entry: 'src/index.js',
  env: {
    development: {
      extraBabelPlugins: ['dva-hmr']
    }
  },
  extraBabelPlugins: [
       ["import", { "libraryName": "antd", "libraryDirectory": "es", "style": "css" }]
  ],
  // 按需加载JS
  // disableDynamicImport: false,
  disableDynamicImport: true,
  // 路径别名
  alias: {
    components: path.resolve(__dirname, 'src/components/'),
  },
  html: {
    template: './src/index.ejs',
  },
  publicPath: '/',
  hash: true,
}
