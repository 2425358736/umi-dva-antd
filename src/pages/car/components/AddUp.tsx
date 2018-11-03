// 添加和修改组件
import React from 'react'
import { Button, DatePicker, Cascader, Input, Form, message, Select } from 'antd'
import { postRequest } from '../../../utils/api'
import { carBrand } from '../../../components/Json/CarJson'
import ColorPicker from 'rc-color-picker'
import 'rc-color-picker/assets/index.css'
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
      color: '#36c'
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
      this.setState({
        color: this.props.color,
      })
      let brand = []
      brand = [this.props.record.brand, this.props.record.lineno, this.props.record.yearno, this.props.record.model]
      this.props.form.setFieldsValue({
        license: this.props.record.license,
        serialno: this.props.record.serialno,
        brands: brand,
        groupno: this.props.record.groupno,
        precheckdate:  moment(this.props.record.precheckdate, 'YYYY-MM-DD'),
        nextcheckdate:  moment(this.props.record.nextcheckdate, 'YYYY-MM-DD'),
        insurancestartdate:  moment(this.props.record.insurancestartdate, 'YYYY-MM-DD'),
        insuranceenddate:  moment(this.props.record.insuranceenddate, 'YYYY-MM-DD'),
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
        json.brand = json.brands[0]
        json.lineno = json.brands[1]
        json.yearno = json.brands[2]
        json.model = json.brands[3]
        json.brands = null
        json.color = this.state.color
        let data
        if (this.props.record.id > 0) {
          json.id = this.props.record.id
          data = await postRequest(
            '/api-biz/vehicle/update',
            json
          )
        } else {
          data = await postRequest(
            '/api-biz/vehicle/save',
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
      const that = this
      return (
        <div style={{ marginLeft: '10%', overflow: 'hidden' }} >
          <Form layout="horizontal">
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
              label="车架号"
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 15 }}
            >
              {getFieldDecorator('serialno', {
                rules: [{
                  required: true,
                  message: '请输入车架号',
                }],
              })(

                <Input placeholder="请输入车架号" />
              )}
            </FormItem>

            <FormItem
              label="品牌->车系->年代->型号"
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 15 }}
            >
              {getFieldDecorator('brands', {
                rules: [{
                  required: true,
                  message: '请选择品牌->车系->年代->型号',
                }],
              })(

                <Cascader options={carBrand}  placeholder="请选择品牌->车系->年代->型号" />
              )}
            </FormItem>

            <FormItem
              label="分组"
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 15 }}
            >
              {getFieldDecorator('groupno', {
                rules: [{
                  required: true,
                  message: '请选择分组',
                }],
              })(

                <Select
                  showSearch={true}
                  placeholder="请选择分组"
                  optionFilterProp="children"
                >
                  <Option key="一组">一组</Option>
                  <Option key="二组">二组</Option>
                  <Option key="三组">三组</Option>
                  <Option key="四组">四组</Option>
                </Select>
              )}
            </FormItem>

            <FormItem
              label="车身颜色"
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 15 }}
            >
                <ColorPicker
                  animation="slide-up"
                  color={this.state.color}
                  onChange={(colors) => {
                    that.setState({
                      color: colors.color
                    })
                  }}
                />
            </FormItem>

            <FormItem
              label="上次年检日期"
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 15 }}
            >
              {getFieldDecorator('precheckdate', {
                rules: [{
                  required: true,
                  message: '请选择上次年检日期',
                }],
              })(

                <DatePicker style={{width: '367px'}} />
              )}
            </FormItem>

            <FormItem
              label="下次年检日期"
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 15 }}
            >
              {getFieldDecorator('nextcheckdate', {
                rules: [{
                  required: true,
                  message: '请选择下次年检日期',
                }],
              })(

                <DatePicker style={{width: '367px'}} />
              )}
            </FormItem>

            <FormItem
              label="保险生效日期"
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 15 }}
            >
              {getFieldDecorator('insurancestartdate', {
                rules: [{
                  required: true,
                  message: '请选择保险生效日期',
                }],
              })(

                <DatePicker style={{width: '367px'}} />
              )}
            </FormItem>

            <FormItem
              label="保险失效日期"
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 15 }}
            >
              {getFieldDecorator('insuranceenddate', {
                rules: [{
                  required: true,
                  message: '请选择保险失效日期',
                }],
              })(

                <DatePicker style={{width: '367px'}} />
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
