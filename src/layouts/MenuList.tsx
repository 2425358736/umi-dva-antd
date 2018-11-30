import React from 'react'
import { Menu, Icon } from 'antd'
import Link from 'umi/link'
import { postRequest } from 'utils/api'

const { SubMenu } = Menu

class MenuList extends React.Component<any, any> {
  constructor(props) {
    super(props)
    const url = location.pathname
    this.state = {
      openKeys: [],
      selectedKeys: [],
      url: url,
      menuList: []
    }
  }
  componentDidMount = async () => {
    let list = []
    const key = []
    const perList = await postRequest('/system/perList')
    const arr = JSON.parse(JSON.stringify(perList.data))
    this.lookup(arr, list, key)
    if (key.length === 0) {
      list = []
    }
    this.setState({
      openKeys: list,
      selectedKeys: key,
      menuList: perList.data
    })
  }

  // 根据连接查询父级目录数组
  lookup = (arr, list, key) => {
    let bol = true
    arr.forEach((json, i) => {
      if (bol) {
        list.push(json.id.toString())
        if (('/' + json.perUrl) === this.state.url) {
          key.push(json.id.toString())
          bol = false
        } else if (typeof json.children !== 'undefined' && json.children.length > 0) {
          this.lookup(json.children, list, key)
        } else if (typeof json.children === 'undefined' || json.children.length === 0) {
          list.splice(list.length - 1, 1)
          if (i === arr.length - 1) {
            list.splice(list.length - 1, 1)
          }
        } else if (i === arr.length - 1) {
          list.splice(list.length - 1, 1)
        }
      }
    })
  }

  recursion = (children) => {
    return children.map(menu => {
      if (menu.perType === 1) {
        return (
          <SubMenu
            key={menu.id}
            title={<span><Icon type={menu.perImg} />{menu.perName}</span>}>
            {
              this.recursion(menu.children)
            }
          </SubMenu>
        )
      } else if (menu.perType === 2) {
        return (
          <Menu.Item key={menu.id}>
            <Link to={'/' + menu.perUrl}>
              <span>{menu.perName}</span>
            </Link>
          </Menu.Item>
        )
      } else {
        return null
      }
    })
  }
  onOpenChange = (openKeys) => {
    if (openKeys.length > 1) {
      openKeys.splice(0, 1)
    }
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
          if (menu.perType === 1) {
            return (
              <SubMenu
                key={menu.id}
                title={<span><Icon type={menu.perImg} /><span>{menu.perName}</span></span>}>
                {
                  this.recursion(menu.children)
                }
              </SubMenu>
            )
          } else if (menu.perType === 2) {
              return (
                <Menu.Item key={menu.id}>
                  <Link to={'/' + menu.perUrl}>
                    <Icon type={menu.perImg} />
                    <span>{menu.perName}</span>
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
