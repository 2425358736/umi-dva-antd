// 设置权限
import React from 'react'
import { Transfer } from 'antd'
import { getRequest } from '../../../../utils/api'
const styles = require('../index.less')

class SetPermissions extends React.Component {
  constructor(props) {
    super(props)
    /**
     *
     * @type
     * {
     *  {
     *    buttonLoading: boolean 按钮加载中 防止重复提交
     *   }
     * }
     */
    this.state = {
      buttonLoading: false,
      listPermissions: [],
      rolePermissionsArr: [],
    }
  }

  componentDidMount() {
    this.initialization()
  }

  /**
   * 初始化方法
   * @returns {Promise<void>}
   */
  initialization = async () => {
    const listPermissions = await getRequest('/api-user/permissions?page=0&limit=99999')
    const rolePermissions = await getRequest('/api-user/permissions/' + this.props.record.id + '/permissions')
    let listPermissionsArr = []
    let rolePermissionsArr = []
    listPermissions.data.forEach((json) => {
      listPermissionsArr.push({id: json.id, name: json.name, permission: json.permission, roleId: this.props.record.id})
    })
    rolePermissions.forEach((json) => {
      listPermissions.data.forEach((json2) => {
        if (json.id === json2.id) {
          rolePermissionsArr.push(json.id)
        }
      })
    })
    this.setState({
      listPermissionsArr,
      rolePermissionsArr,
    })
  }

  filterOption = (inputValue, option) => {
    return option.name.indexOf(inputValue) > -1
  }

  /**
   * 取消方法
   */
  handleCancel = () => {
    this.props.callback({ type: 'cancel' })
  }

  handleChange = (targetKeys, direction, moveKeys) => {
    debugger
    this.setState({ rolePermissionsArr: targetKeys })
  }
  render() {
    return (
      <div style={{ marginLeft: '10%', overflow: 'hidden' }} >
        <Transfer
          dataSource={this.state.listPermissionsArr}
          showSearch={true}
          filterOption={this.filterOption}
          targetKeys={this.state.rolePermissionsArr}
          onChange={this.handleChange}
          rowKey={record => record.id}
          render={item => item.name}
        />
      </div>
    )
  }
}

export default SetPermissions
