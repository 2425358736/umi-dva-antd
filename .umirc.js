/*
 * @Author: yanxiaodi 929213769@qq.com
 * @Date: 2018-09-17 11:11:16
 * @LastEditors: yanxiaodi 929213769@qq.com
 * @LastEditTime: 2018-10-10 00:32:06
 * @Description: umi config
 */
import { resolve } from 'path'

export default {
  plugins: [
    ['umi-plugin-react', {
      dva: true,
      antd: true,
    }],
  ],
  extraBabelPlugins: [
    ["import", {
      libraryName: 'ant-design-pro',
      libraryDirectory: 'lib',
      style: true,
      camel2DashComponentName: false,
    }]
  ],

  alias: {
    components: resolve(__dirname, './src/components'),
    services: resolve(__dirname, './src/services'),
    assets: resolve(__dirname, './src/assets'),
    utils: resolve(__dirname, "./src/utils"),
  },

  theme: {
    "@primary-color": '#1DA57A',
  },

  routes: [
    {
      path: '/login',
      exact: true,
      component: 'login',
    },
    { // 永远在最后进行匹配
      path: '/',
      component: '../layouts',
      Routes: ['./routes/PrivateRoute.js'], // 用于权限权限控制
      routes: [
        { path: '/', component: 'index' },
        { path: '/users', component: 'users' },
        { path: '/user/role', component: 'user/role' },
        { path: '/user/user', component: 'user/user' },
        { path: '/user/urisdiction', component: 'user/urisdiction' },
      ],
    },
  ],
}
