// 添加和修改组件
import React from 'react'
import { Button, Input, Form, message, Select, DatePicker } from 'antd'
import { postRequest, getRequest } from '../../../utils/api'
import moment from 'moment'
const styles = require('../index.less')

const FormItem = Form.Item
const { Option } = Select

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
      userList: [],
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
    this.props.form.resetFields()
    if (this.props.record.id > 0) {
      this.props.form.setFieldsValue({
        username: this.props.record.username,
        allowcode: this.props.record.allowcode,
        violationtime: moment(this.props.record.violationtime, 'YYYY-MM-DD'),
        license: this.props.record.license,
        address: this.props.record.address,
        monitorid: this.props.record.monitorid,
        fineamount: this.props.record.fineamount,
        deductpoints: this.props.record.deductpoints,
        status: this.props.record.status.toString(),
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
            '/api-biz/violation/update',
            json
          )
        } else {
          data = await postRequest(
            '/api-biz/violation/save',
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
              label="识别码"
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 15 }}
            >
              {getFieldDecorator('allowcode', {
                  rules: [{
                    required: true,
                    message: '请输入识别码',
                  }],
                })(

                  <Input placeholder="请输入识别码" />
                )}
            </FormItem>
            <FormItem
              label="违章时间"
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 15 }}
            >
              {getFieldDecorator('violationtime', {
                rules: [{
                  required: true,
                  message: '请选择违章时间',
                }],
              })(

                <DatePicker style={{width: '256px'}} />
              )}
            </FormItem>
            <FormItem
              label="车牌号"
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 15 }}
            >
              {getFieldDecorator('license', {
                rules: [{
                  required: true,
                  message: '请输入车牌号',
                }],
              })(

                <Input placeholder="请输入车牌号" />
              )}
            </FormItem>

            <FormItem
              label="违章地点"
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 15 }}
            >
              {getFieldDecorator('address', {
                rules: [{
                  required: true,
                  message: '请输入违章地点',
                }],
              })(

                <Input placeholder="请输入违章地点" />
              )}
            </FormItem>

            <FormItem
              label="监控编号"
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 15 }}
            >
              {getFieldDecorator('monitorid', {
                rules: [{
                  required: true,
                  message: '请输入监控编号',
                }],
              })(

                <Input placeholder="请输入监控编号" />
              )}
            </FormItem>

            <FormItem
              label="罚款金额"
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 15 }}
            >
              {getFieldDecorator('fineamount', {
                rules: [{
                  required: true,
                  message: '请输入罚款金额',
                }],
              })(

                <Input placeholder="请输入罚款金额" />
              )}
            </FormItem>

            <FormItem
              label="违章扣分"
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 15 }}
            >
              {getFieldDecorator('deductpoints', {
                rules: [{
                  required: true,
                  message: '请输入违章扣分',
                }],
              })(

                <Input placeholder="请输入违章扣分" />
              )}
            </FormItem>

            <FormItem
              label="处理状态"
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 15 }}
            >
              {getFieldDecorator('status', {
                rules: [{
                  required: true,
                  message: '请选择处理状态',
                }],
              })(
                <Select
                  showSearch={true}
                  placeholder="请选择用户名"
                  optionFilterProp="children"
                >
                  <Option key="0">未处理</Option>
                  <Option key="2">已处理</Option>
                </Select>
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
