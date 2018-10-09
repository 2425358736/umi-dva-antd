/*
 * @Author: yanxiaodi 929213769@qq.com
 * @Date: 2018-09-17 11:11:16
 * @LastEditors: yanxiaodi 929213769@qq.com
 * @LastEditTime: 2018-09-17 11:11:36
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

  alias: {
    components: resolve(__dirname, './src/components'),
    services: resolve(__dirname, './src/services'),
    assets: resolve(__dirname, './src/assets'),
    utils: resolve(__dirname, "./src/utils"),
  },

  theme: {
    "@primary-color": '#1DA57A',
  }
}
