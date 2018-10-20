import React from 'react'
import { Menu, Icon } from 'antd'
import MenuJson from './MenuJson'
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
      menuList: MenuJson
    }
  }
  componentDidMount = () => {
    let list = []
    const key = []
    const arr = JSON.parse(JSON.stringify(this.state.menuList))
    this.lookup(arr, list, key)
    if (key.length === 0) {
      list = []
    }
    this.setState({
      openKeys: list,
      selectedKeys: key
    })
  }

  // 根据连接查询父级目录数组
  lookup = (arr, list, key) => {
    let bol = true
    arr.forEach((json, i) => {
      if (bol) {
        list.push(json.key.toString())
        if (json.path === this.state.url) {
          key.push(json.key.toString())
          bol = false
        } else if (typeof json.children !== 'undefined' && json.children.length > 0) {
          this.lookup(json.children, list, key)
        } else if (i === arr.length - 1) {
          list.splice(list.length - 1, 1)
        } else if (typeof json.children === 'undefined') {
          list.splice(list.length - 1, 1)
        }
      }
    })
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
        mode="inline"
        theme="dark"
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
                title={<span><Icon type={menu.icon} /><span>{menu.name}</span></span>}>
                {
                  this.recursion(menu.children)
                }
              </SubMenu>
            )
          } else if (menu.type === 1) {
              return (
                <Menu.Item key={menu.key}>
                  <Link to={menu.path}>
                    <Icon type={menu.icon} />
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
