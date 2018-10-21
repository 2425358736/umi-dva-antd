// 设置角色
import React from 'react'
import { Transfer, Button, message } from 'antd'
import { getRequest, postRequest } from '../../../../utils/api'
const styles = require('../index.less')

class SetRole extends React.Component {
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
      listRoleArr: [],
      roleUserRoleArr: [],
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
    const listRole = await getRequest('/api-user/roles?page=0&limit=99999')
    const roleUserRole = this.props.record.roles
    let listRoleArr = []
    let roleUserRoleArr = []
    listRole.data.forEach((json) => {
      listRoleArr.push({id: json.id, name: json.name})
    })
    roleUserRole.forEach((json) => {
      listRole.data.forEach((json2) => {
        if (json.id === json2.id) {
          roleUserRoleArr.push(json.id)
        }
      })
    })

    this.setState({
      listRoleArr,
      roleUserRoleArr,
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
        '/api-user/users/' + this.props.record.id + '/roles',
        this.state.roleUserRoleArr
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
    this.setState({ roleUserRoleArr: targetKeys })
  }
  render() {
    return (
      <div style={{ marginLeft: '10%', overflow: 'hidden' }} >
        <Transfer
          listStyle={{
            width: 300,
            height: 500,
          }}
          titles={['可用的角色', '当前拥有的角色']}
          dataSource={this.state.listRoleArr}
          showSearch={true}
          filterOption={this.filterOption}
          targetKeys={this.state.roleUserRoleArr}
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

export default SetRole
