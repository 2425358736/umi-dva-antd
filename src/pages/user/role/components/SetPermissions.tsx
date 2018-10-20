// 设置权限
import React from 'react'
import { Transfer, Button, message } from 'antd'
import { getRequest, postRequest } from '../../../../utils/api'
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

  /**
   * 表单提交方法
   * @returns {Promise<void>}
   */
  handleSubmit = async () => {
      this.setState({
        buttonLoading: true,
      })
      const data = await postRequest(
        '/api-user/permissions/granted',
        {roleId: this.props.record.id, authIds: this.state.rolePermissionsArr}

      )
      if (data.resp_code === 0) {
        this.props.callback({ type: 'submit' })
      }
      message.success(`${data.resp_msg}`)
      this.setState({
        buttonLoading: false,
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

  handleChange = (targetKeys) => {
    this.setState({ rolePermissionsArr: targetKeys })
  }
  render() {
    return (
      <div style={{ marginLeft: '10%', overflow: 'hidden' }} >
        <Transfer
          listStyle={{
            width: 300,
            height: 500,
          }}
          titles={['可用的权限', '当前拥有的权限']}
          dataSource={this.state.listPermissionsArr}
          showSearch={true}
          filterOption={this.filterOption}
          targetKeys={this.state.rolePermissionsArr}
          onChange={this.handleChange}
          rowKey={record => record.id}
          render={item => item.name}
        />
        <div style={{ float: 'right', marginRight: '8%', marginTop: 20 }}>
          <Button
            onClick={this.handleCancel}
            style={{ backgroundColor: 'rgba(243, 243, 243, 1)', color: '#666666', marginRight: 20 }}
          >取消
          </Button>
          <Button
            loading={this.state.buttonLoading}
            onClick={this.handleSubmit}
            type="primary"
            style={{ }}
          >提交
          </Button>
        </div>
      </div>
    )
  }
}

export default SetPermissions
