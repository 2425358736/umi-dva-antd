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
    "primary-color": '#1DA57A',
    "link-color": '#1890ff',                         // 链接色
    "success-color": '#52c41a',                         // 成功色
    "warning-color": '#faad14;',                        // 警告色
    "error-color": '#f5222d;',                          // 错误色
    "font-size-base": '14px',                          // 主字号
    "heading-color": 'rgba(0, 0, 0, .85)',            // 标题色
    "text-color": 'rgba(0, 0, 0, .65);',                // 主文本色
    "text-color-secondary" : 'rgba(0, 0, 0, .45)',      // 次文本色
    "disabled-color" : 'rgba(0, 0, 0, .25)',            // 失效色
    "border-radius-base": '4px',                        // 组件/浮层圆角
    "border-color-base": '#d9d9d9',                     // 边框色
    "box-shadow-base": '0 2px 8px rgba(0, 0, 0, .15)'
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
        { path: '/error/404', component: 'error/404' },
        { path: '/error/401', component: 'error/401' },
        { path: '/error/403', component: 'error/403' },
        { path: '/error/500', component: 'error/500' },
        { path: '/user/role', component: 'user/sysDepartment' },
        { path: '/sysuser', component: 'user/user' },
        { path: '/mycompany', component: 'user/urisdiction' },
        { path: '/map001', component: 'map/map001' },
      ],
    },
  ],
}
