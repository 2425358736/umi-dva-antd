import React from 'react'
import withRouter from 'umi/withRouter'
import dynamic from 'umi/dynamic'
import { connect } from 'dva'
import { LocaleProvider, Pagination } from 'antd'
import get from 'lodash/get'

import zhCN from 'antd/lib/locale-provider/zh_CN'
import enUS from 'antd/lib/locale-provider/en_US'

interface Props {
  message: string,
  lang: 'zh_CN' | 'en_US',
  children: React.ReactChildren,
}

const LazyLoad = dynamic({
  loader: () => import('./LazyLoad'),
})

const Layout = (props: any) =>
  <>
    <h2>Layouts</h2>
    <h3>message from global model: {props.message}</h3>
    <hr />

    <span> 测试 antd 组件 国际化 </span>
    <Pagination defaultCurrent={1} total={50} showSizeChanger={true} />

    <hr />
    {props.children}
  </>

@connect(
  state => ({
    message: get(state, 'global.message'),
    lang: get(state, 'global.lang'),
  })
)
class Root extends React.Component<Props, {}> {
  render() {
    return (
      <LocaleProvider locale={this.props.lang === 'zh_CN' ? zhCN : enUS}>
        <Layout {...this.props} />
      </LocaleProvider>
    )
  }
}

export default withRouter(Root)
