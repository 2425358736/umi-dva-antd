// 添加和修改组件
import React from 'react'
import { Button, Select, Input, Form, message } from 'antd'
import { postFormDateRequest } from '../../../utils/api'
const styles = require('../index.less')

const FormItem = Form.Item
const Option = Select.Option
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
    debugger
    this.props.form.resetFields()
    if (this.props.record.id > 0) {
      this.props.form.setFieldsValue({
        orderstatus: this.props.record.status.toString(),
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
          json.orderid = this.props.record.id
          data = await postFormDateRequest(
            '/api-biz/orders/updateOrderStatus',
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
              label="订单状态"
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 15 }}
            >
              {getFieldDecorator('orderstatus', {
                  rules: [{
                    required: true,
                    message: '请选择订单状态',
                  }],
                })(

                <Select>
                  <Option value="0">订单未开始</Option>
                  <Option value="1">订单计费中</Option>
                  <Option value="2">等待支付</Option>
                  <Option value="3">订单取消</Option>
                  <Option value="4">订单完成</Option>
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
