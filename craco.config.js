const CracoLessPlugin = require('craco-less');
module.exports = {
  //下载babel-plugin-import
  babel: {
    plugins: [
      ['import', { libraryName: 'antd', style: true }],
      ['@babel/plugin-proposal-decorators', { legacy: true }]
    ]
  },
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: { '@primary-color': '#7cb421' },
            javascriptEnabled: true,
          },
        },
      },
    },
  ],
};