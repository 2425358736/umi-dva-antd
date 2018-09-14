import { resolve } from 'path'

export default {
  plugins: [
    ['umi-plugin-react', {
      dva: true,
      antd: true,
    }],
  ],
  publicPath: '/static/',
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
