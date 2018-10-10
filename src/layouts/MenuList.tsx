import React from 'react'
import { Menu, Icon } from 'antd'
import Link from 'umi/link'
const { SubMenu } = Menu

class MenuList extends React.Component {
  constructor(props) {
    super(props)
    const url = location.pathname
    this.state = {
      openKeys: [],
      selectedKeys: [],
      url: url,
      menuList: [
        {
          name: '系统设置',
          icon: 'setting',
          path: '',
          key: 1,
          type: 0,
          children: [
            {
              name: '部门管理',
              icon: '',
              path: '/user/department',
              key: 2,
              type: 1,
            },
            {
              name: '角色管理',
              icon: '',
              path: '/user/role',
              key: 3,
              type: 1,
            },
            {
              name: '用户管理',
              icon: '',
              path: '/user/user',
              key: 4,
              type: 1,
            },
            {
              name: '权限管理',
              icon: '',
              path: '/user/urisdiction',
              key: 5,
              type: 1,
            },
            {
              name: '父菜单',
              icon: 'setting',
              path: '',
              key: 6,
              type: 0,
              children: [
                {
                  name: '子页面',
                  icon: '',
                  path: '/user/urisdiction',
                  key: 7,
                  type: 1,
                },
              ]
            },
          ]
        }
      ]
    }
  }
  recursion = (children) => {
    return children.map(menu => {
      if (menu.type === 0) {
        return (
          <SubMenu
            key={menu.key}
            title={<span><Icon type={menu.icon} />{menu.name}</span>}>
            {
              this.recursion(menu.children)
            }
          </SubMenu>
        )
      } else if (menu.type === 1) {
        return (
          <Menu.Item key={menu.key}>
            <Link to={menu.path}>
              <span>{menu.name}</span>
            </Link>
          </Menu.Item>
        )
      } else {
        return null
      }
    })
  }
  onOpenChange = (openKeys) => {
    this.setState({
      openKeys: openKeys
    })
  }
  onSelect = (item) => {
    this.setState({
      selectedKeys: item.selectedKeys
    })
  }
  render() {
    return (
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={this.state.selectedKeys}
        openKeys={this.state.openKeys}
        onOpenChange = {this.onOpenChange}
        onSelect = {this.onSelect}
      >
        {this.state.menuList.map(menu => {
          if (menu.type === 0) {
            return (
              <SubMenu
                key={menu.key}
                title={!this.props.collapsed ?
                  (<span><Icon type={menu.icon} />{menu.name}</span>) : (<Icon type={menu.icon} />)}>
                {
                  this.recursion(menu.children)
                }
              </SubMenu>
            )
          } else if (menu.type === 1) {
              return (
                <Menu.Item key={menu.key}>
                  <Link to={menu.path}>
                    <span>{menu.name}</span>
                  </Link>
                </Menu.Item>
              )
          } else {
            return null
          }
        })}
      </Menu>
    )
  }
}

export default MenuList
