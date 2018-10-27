// 添加和修改组件
import React from 'react'
import moment from 'moment'
import { Button, Select, Input, Form, message, DatePicker } from 'antd'
import { postRequest } from '../../../utils/api'
const styles = require('../index.less')

const FormItem = Form.Item

const Option = Select.Option

const { TextArea } = Input

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
        mobile: this.props.record.mobile,
        birthday: this.props.record.licensefromdate ? moment(this.props.record.birthday, 'YYYY-MM-DD') : null,
        licensefromdate: this.props.record.licensefromdate ?
          moment(this.props.record.licensefromdate, 'YYYY-MM-DD') : null,
        licenseexpirydate: this.props.record.licenseexpirydate ?
          moment(this.props.record.licenseexpirydate, 'YYYY-MM-DD') : null,
        licensetype: this.props.record.licensetype,
        status: this.props.record.status.toString(),
        remarks: this.props.record.remarks,
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
            '/api-biz/renter/update',
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
              label="姓名"
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 15 }}
            >
              {getFieldDecorator('username', {
                  rules: [{
                    required: true,
                    message: '请输入姓名',
                  }],
                })(

                  <Input placeholder="请输入姓名" />
                )}
            </FormItem>
            <FormItem
              label="手机号"
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 15 }}
            >
              {getFieldDecorator('mobile', {
                  rules: [{
                    required: true,
                    message: '请输入手机号',
                  }],
                })(

                  <Input placeholder="请输入手机号" />
                )}
            </FormItem>

            <FormItem
              label="出生日期"
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 15 }}
            >
              {getFieldDecorator('birthday', {
                rules: [{
                  required: true,
                  message: '请选择出生日期',
                }],
              })(

                <DatePicker style={{width: '367px'}} />
              )}
            </FormItem>

            <FormItem
              label="领证日期"
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 15 }}
            >
              {getFieldDecorator('licensefromdate', {
                rules: [{
                  required: true,
                  message: '请选择领证日期',
                }],
              })(

                <DatePicker style={{width: '367px'}} />
              )}
            </FormItem>

            <FormItem
              label="驾照到期日期"
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 15 }}
            >
              {getFieldDecorator('licenseexpirydate', {
                rules: [{
                  required: true,
                  message: '请选择驾照到期日期',
                }],
              })(

                <DatePicker style={{width: '367px'}} />
              )}
            </FormItem>

            <FormItem
              label="准驾车型"
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 15 }}
            >
              {getFieldDecorator('licensetype', {
                rules: [{
                  required: true,
                  message: '请输入准驾车型',
                }],
              })(

                <Input placeholder="请输入准驾车型" />
              )}
            </FormItem>

            <FormItem
              label="状态"
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 15 }}
            >
              {getFieldDecorator('status', {
                rules: [{
                  required: true,
                  message: '请选择状态',
                }],
              })(

                <Select>
                  <Option value="0">待审核</Option>
                  <Option value="1">已注册</Option>
                </Select>
              )}
            </FormItem>

            <FormItem
              label="备注"
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 15 }}
            >
              {getFieldDecorator('remarks', {
                rules: [{
                  required: true,
                  message: '请输入备注',
                }],
              })(
                <TextArea rows={4} />
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
