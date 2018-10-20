import React from 'react'
import withRouter from 'umi/withRouter'
import { LocaleProvider, Layout, Icon } from 'antd'
import styles from './index.css'
import zhCN from 'antd/lib/locale-provider/zh_CN'
import enUS from 'antd/lib/locale-provider/en_US'
import MenuList from './MenuList'
import GlobalHeader from  '../components/GlobalHeader'
import { getRequest } from '../utils/api'

const { Header, Sider, Content } = Layout

interface Props {
  message: string,
  lang: 'zh_CN' | 'en_US',
  children: React.ReactChildren,
}

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
    const currentUser = await getRequest('/api-user/users/current')
    this.setState({
      currentUser
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
          >
            <div className={styles.logo} />
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
          </Layout>
        </Layout>
      </LocaleProvider>
    )
  }
}

export default withRouter(Root)
