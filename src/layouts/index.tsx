import React from 'react'
import withRouter from 'umi/withRouter'
import { LocaleProvider, Layout, Affix, Button } from 'antd'
import styles from './index.css'
import zhCN from 'antd/lib/locale-provider/zh_CN'
import enUS from 'antd/lib/locale-provider/en_US'
import MenuList from './MenuList'
import GlobalHeader from  '../components/GlobalHeader'
import { postRequest } from '../utils/api'
import router from 'umi/router'
import { connect } from 'dva'

const { Header, Sider, Content } = Layout

interface Props {
  message: string,
  lang: 'zh_CN' | 'en_US',
  children: React.ReactChildren,
}

@connect(({ globalVariable }) => ({
  layout: globalVariable.data.layout,
}))
class Root extends React.Component<Props, {}> {
  state = {
    collapsed: false,
    currentUser: {}
  }

  handleMenuCollapse = collapsed => {
    this.setState({
      collapsed: !this.state.collapsed,
    })
  }
  componentDidMount = async () => {
    const currentUser = await postRequest('/system/getUserName')
    this.setState({
      currentUser: currentUser.data
    })
  }

  render() {
    return (
      <LocaleProvider locale={this.props.lang === 'zh_CN' ? zhCN : enUS}>
        <Layout style={{height: '657px'}}>
          <Sider
            trigger={null}
            collapsible={true}
            collapsed={this.state.collapsed}
            width={256}
            breakpoint="lg"
          >
              <a><div className={styles.logo} onClick={() => {router.push('/')}} /></a>
            <MenuList />
          </Sider>
          <Layout>
            <Header style={{ background: '#fff', padding: 0 }}>
              <GlobalHeader
                collapsed={true}
                onCollapse={this.handleMenuCollapse}
                currentUser={this.state.currentUser}
              />
            </Header>
            <Content style={{ margin: '24px 16px',
              padding: 24, background: '#fff', minHeight: 280, overflowX: 'hidden' }}>
              {this.props.children}
            </Content>
            {/*<Affix offsetTop={120} onChange={affixed => console.log(affixed)}>*/}
              {/*<Button onClick={() => {*/}
                {/*const { dispatch } = this.props*/}
                {/*dispatch({*/}
                  {/*type: 'globalVariable/updateType',*/}
                  {/*payload: {layout: this.props.layout === 0 ? 1 : 0},*/}
                {/*})*/}
                {/*}*/}
              {/*}>120px to affix top</Button>*/}
            {/*</Affix>*/}
          </Layout>
        </Layout>
      </LocaleProvider>
    )
  }
}

export default withRouter(Root)
