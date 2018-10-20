import React from 'react'
import withRouter from 'umi/withRouter'
import { LocaleProvider, Layout, Icon } from 'antd'
import styles from './index.css'
import zhCN from 'antd/lib/locale-provider/zh_CN'
import enUS from 'antd/lib/locale-provider/en_US'
import MenuList from './MenuList'

const { Header, Sider, Content } = Layout

interface Props {
  message: string,
  lang: 'zh_CN' | 'en_US',
  children: React.ReactChildren,
}

class Root extends React.Component<Props, {}> {
  state = {
    collapsed: false,
  }

  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed,
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
              <Icon
                className={styles.trigger}
                type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
                onClick={this.toggle}
              />
            </Header>
            <Content style={{ margin: '24px 16px', padding: 24, background: '#fff', minHeight: 280 }}>
              {this.props.children}
            </Content>
          </Layout>
        </Layout>
      </LocaleProvider>
    )
  }
}

export default withRouter(Root)
