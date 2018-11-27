import React, { PureComponent } from 'react'
import { Menu, Icon, Spin, Tag, Dropdown, Avatar, Tooltip } from 'antd'
import { NoticeIcon } from 'ant-design-pro'
import { HeaderSearch } from 'ant-design-pro'
const styles = require('./index.less')
import Link from 'umi/link'
import HeaderSearch from 'ant-design-pro/lib/HeaderSearch'

export default class GlobalHeader extends PureComponent {

  toggle = () => {
    const { collapsed, onCollapse } = this.props
    onCollapse(!collapsed)
  }
  render() {
    const {
      currentUser = {},
      collapsed,
      onMenuClick,
    } = this.props
    const menu = (
      <Menu className={styles.menu} selectedKeys={[]} onClick={onMenuClick}>
        <Menu.Item>
          <Icon type="user" />
          个人中心
        </Menu.Item>
        <Menu.Item>
          <Icon type="mail" />
          收件箱
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item key="logout" onClick={() => {
          localStorage.removeItem('Authorization')
        }}>
          <Link to="/login">
            <Icon type="logout" />
            退出登录
          </Link>
        </Menu.Item>
      </Menu>
    )

    return (
      <div className={styles.header}>
        <Icon
          className={styles.trigger}
          type={collapsed ? 'menu-unfold' : 'menu-fold'}
          onClick={this.toggle}
        />
        <div className={styles.right}>
          <HeaderSearch
            className={`${styles.action} ${styles.search}`}
            placeholder="站内搜索"
            onSearch={value => {
              console.log('input', value) // eslint-disable-line
            }}
            onPressEnter={value => {
              console.log('enter', value) // eslint-disable-line
            }}
          />
          <Tooltip title="使用文档">
            <a
              target="_blank"
              href="#"
              rel="noopener noreferrer"
              className={styles.action}
            >
              <Icon type="question-circle-o" />
            </a>
          </Tooltip>
          {currentUser.loginName ? (
            <Dropdown overlay={menu}>
              <span className={`${styles.action} ${styles.account}`}>
                <Avatar size="small" className={styles.avatar} src={currentUser.loginName} />
                <span className={styles.name}>{currentUser.loginName}</span>
              </span>
            </Dropdown>
          ) : (
            <Spin size="small" style={{ marginLeft: 8 }} />
          )}
        </div>
      </div>
    )
  }
}
