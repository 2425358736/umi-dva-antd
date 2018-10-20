// 添加和修改组件
import React from 'react'
import { Button, Input, Form, message } from 'antd'
import { postRequest } from '../../../../utils/api'
const styles = require('../index.less')

const FormItem = Form.Item
class AddUp extends React.Component {
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
    if (this.props.record.id > 0) {
      this.props.form.setFieldsValue({
        username: this.props.record.username,
        password: this.props.record.password,
        phone: this.props.record.phone,
        nickname: this.props.record.nickname,
      })
    }
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
          json.id = this.props.record.id
          data = await postRequest(
            '/api-user/users/saveOrUpdate',
            json
          )
        } else {
          data = await postRequest(
            '/api-user/users/saveOrUpdate',
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
              label="登录用户名"
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 15 }}
            >
              {getFieldDecorator('username', {
                  rules: [{
                    required: true,
                    message: '请输入登录用户名',
                  }],
                })(

                  <Input placeholder="请输入登录用户名" />
                )}
            </FormItem>
            {!this.props.record.id > 0 && (
            <FormItem
              label="密码"
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 15 }}
            >
              {getFieldDecorator('password', {
                rules: [{
                  required: true,
                  message: '请输入密码',
                }],
              })(

                <Input placeholder="请输入密码" />
              )}
            </FormItem>
            )}
            <FormItem
              label="手机号"
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 15 }}
            >
              {getFieldDecorator('phone', {
                rules: [{
                  required: true,
                  message: '请输入手机号',
                }],
              })(

                <Input placeholder="请输入手机号" />
              )}
            </FormItem>

            <FormItem
              label="昵称"
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 15 }}
            >
              {getFieldDecorator('nickname', {
                rules: [{
                  required: true,
                  message: '请输入昵称',
                }],
              })(

                <Input placeholder="请输入昵称" />
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

const AddUpComponent = Form.create()(AddUp)

export default AddUpComponent
