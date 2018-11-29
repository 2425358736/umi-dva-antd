import React from 'react'
import { Select, Radio, Button, Input, Form, message } from 'antd'
const styles = require('../index.less')
import { postRequest } from '../../../../utils/api'

const FormItem = Form.Item
const SelectOption = Select.Option
const RadioButton = Radio.Button
const RadioGroup = Radio.Group
class AddUp extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      buttonLoading: false,
    }
  }

  componentDidMount() {
    this.initialization()
  }

  initialization = async () => {
    this.props.form.resetFields()
    if (this.props.id > 0) {
      let department = await postRequest('/system/getDepartment', { id: this.props.id })
      department = department.data
      this.props.form.setFieldsValue({
        departmentName: department.departmentName,
        departmentNumber: department.departmentNumber,
        remarks: department.remarks,
        parentName: this.props.parentName,
      })
    } else {
      this.props.form.setFieldsValue({
        parentName: this.props.parentName,
      })
    }
  }

  handleSubmit = async () => {
    let adopt = false
    this.props.form.validateFields(err => {
      if (err) {
        adopt = false
      } else {
        adopt = true
      }
    })
    if (adopt) {
      this.setState({
        buttonLoading: true,
      })
      const json = this.props.form.getFieldsValue()
      let data
      if (this.props.id > 0) {
        json.id = this.props.id
        data = await postRequest('/system/updateDepartment', json)
        message.success(`${data.message}`)
      } else {
        json.parentId = this.props.parentId
        data = await postRequest('/system/insertDepartment', json)
        message.success(`${data.message}`)
      }
      if (data.code === 0) {
        this.props.callback({ type: 'submit' })
      }
      this.setState({
        buttonLoading: false,
      })
    }
  }

  handleCancel = () => {
    this.props.callback({ type: 'cancel' })
  }

  render() {
    const { getFieldDecorator } = this.props.form
    return (
      <div style={{ marginLeft: '10%', overflow: 'hidden' }}>
        <Form layout="horizontal">
          <FormItem label="部门名称" labelCol={{ span: 5 }} wrapperCol={{ span: 15 }}>
            {getFieldDecorator('departmentName', {
              rules: [
                {
                  required: true,
                  message: '请输入部门名称',
                },
              ],
            })(<Input placeholder="请输入部门名称" />)}
          </FormItem>
          <FormItem label="部门编号" labelCol={{ span: 5 }} wrapperCol={{ span: 15 }}>
            {getFieldDecorator('departmentNumber', {
              rules: [
                {
                  required: true,
                  message: '请输入部门编号',
                },
              ],
            })(<Input placeholder="请输入部门编号" />)}
          </FormItem>
          <FormItem label="父级部门" labelCol={{ span: 5 }} wrapperCol={{ span: 15 }}>
            {getFieldDecorator('parentName', {
            })(<Input placeholder="父级部门" />)}
          </FormItem>
          <FormItem label="备注" labelCol={{ span: 5 }} wrapperCol={{ span: 15 }}>
            {getFieldDecorator('remarks')(<Input type="textarea" rows={4} />)}
          </FormItem>
        </Form>
        <div style={{ float: 'right', marginRight: '8%', marginTop: 20 }}>
          <Button
            onClick={this.handleCancel}
            style={{ backgroundColor: 'rgba(243, 243, 243, 1)', color: '#666666', marginRight: 20 }}
          >
            取消
          </Button>
          <Button
            loading={this.state.buttonLoading}
            onClick={this.handleSubmit}
            type="primary"
            style={{}}
          >
            提交
          </Button>
        </div>
      </div>
    )
  }
}

const AddUpComponent = Form.create()(AddUp)

export default AddUpComponent
