// 添加和修改组件
import React from 'react'
import { Button, DatePicker, Select, Input, Form, message } from 'antd'
import { postFormDateRequest, getRequest } from '../../../utils/api'
const styles = require('../index.less')

const FormItem = Form.Item
const { Option } = Select
class Grant extends React.Component {
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
      userList: [],
      buttonLoading: false,
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
    this.props.form.resetFields()
    const userList = await getRequest('/api-biz/renter/list?page=0&limit=99999')
    this.setState({
      userList: userList.data
    })
  }

  /**
   * 表单提交方法
   * @returns {Promise<void>}
   */
  handleSubmit = async () => {
    let adopt = false
    this.props.form.validateFields(
      (err) => {
        if (err) {
          adopt = false
        } else {
          adopt = true
        }
      },
    )
    if (adopt) {
      this.setState({
        buttonLoading: true,
      })
      const json = this.props.form.getFieldsValue()
      let data
      if (this.props.record.id > 0) {
        json.voucherid = this.props.record.id
        data = await postFormDateRequest(
          '/api-biz/vouchergrant/grant',
          json
        )
      }
      if (data.resp_code === 0) {
        this.props.callback({ type: 'submit' })
      }
      message.success(`${data.resp_msg}`)
      this.setState({
        buttonLoading: false,
      })
    }
  }

  /**
   * 取消方法
   */
  handleCancel = () => {
    this.props.callback({ type: 'cancel' })
  }
  render() {
    const { getFieldDecorator } = this.props.form
    return (
      <div style={{ marginLeft: '10%', overflow: 'hidden' }} >
        <Form layout="horizontal">
          <FormItem
            label="用户名"
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 15 }}
          >
            {getFieldDecorator('username', {
              rules: [{
                required: true,
                message: '请选择用户名',
              }],
            })(

              <Select
                showSearch={true}
                placeholder="请选择用户名"
                optionFilterProp="children"
              >
                {this.state.userList.map(user => {
                  return (<Option key={user.username}>{user.username}</Option>)
                })}
              </Select>
            )}
          </FormItem>

          <FormItem
            label="生效日期"
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 15 }}
          >
            {getFieldDecorator('starttime', {
              rules: [{
                required: true,
                message: '请选择生效日期',
              }],
            })(

              <DatePicker style={{width: '367px'}} />
            )}
          </FormItem>

          <FormItem
            label="失效日期"
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 15 }}
          >
            {getFieldDecorator('endtime', {
              rules: [{
                required: true,
                message: '请选择失效日期',
              }],
            })(

              <DatePicker style={{width: '367px'}} />
            )}
          </FormItem>

          <FormItem
            label="发放数量"
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 15 }}
          >
            {getFieldDecorator('vouchercount', {
              rules: [{
                required: true,
                message: '请输入发放数量',
              }],
            })(

              <Input placeholder="请输入发放数量" />
            )}
          </FormItem>
        </Form>
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

const GrantComponent = Form.create()(Grant)

export default GrantComponent
