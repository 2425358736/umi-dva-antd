// 添加用户 修改用户
import React from 'react'
import { Select, Radio, Button, Input, Form, message } from 'antd'
import { post } from '../../../../utils/api'
const styles = require('../user.less')

const FormItem = Form.Item
const SelectOption = Select.Option
const RadioButton = Radio.Button
const RadioGroup = Radio.Group
class UserAddUp extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      roles: [],
      buttonLoading: false,
    }
  }

  componentDidMount() {
    this.initialization()
  }
  initialization = async () => {
    this.props.form.resetFields()
    if (this.props.id > 0) {
      let user = await post(
        '/system/getUser',
        { id: this.props.id }
      )
      user = user.data
      const RoleList = await post(
        '/system/roleListDepartment',
        { departmentId: user.departmentId }
      )
      this.setState({
        roles: RoleList.data,
      })
      this.props.form.setFieldsValue({
        departmentId: user.departmentName,
        loginName: user.loginName,
        phone: user.phone,
        roleId: user.roleId,
        loginFlag: user.loginFlag,
        remark: user.remark,
      })
    } else {
      this.props.form.setFieldsValue({
        loginFlag: 1,
      })
    }
  }
    departmentId = async (value) => {
      const RoleList = await post(
        '/system/roleListDepartment',
        { departmentId: value }
      )
      this.setState({
        roles: [],
      })
    }
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
        // console.log(this.props);
        if (!(json.departmentId > 0)) {
          json.departmentId = null
        }
        let data
        if (this.props.id > 0) {
          json.id = this.props.id
          data = await post(
            '/system/updateUser',
            json
          )
          message.success(`${data.message}`)
        } else {
          data = await post(
            '/system/insertUser',
            json
          )
          message.success(`${data.message}`)
        }
        if (data.code !== 140) {
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
    confirm = (rule, value, callback) => {
      const passWord = this.props.form.getFieldValue('passWord')
      const passWordTwo = this.props.form.getFieldValue('passWordTwo')
      if (passWord && passWordTwo && passWord !== passWordTwo) {
        callback('两次密码输入不一致')
      } else {
        callback()
      }
    }
    render() {
      const { getFieldDecorator } = this.props.form
      const { department } = this.props
      return (
        <div style={{ marginLeft: '10%', overflow: 'hidden' }} >
          <Form layout="horizontal">
            <FormItem
              label="所属部门"
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 15 }}
            >
              {getFieldDecorator('departmentId', {
                  rules: [{
                    required: true,
                    message: '请选择所属部门',
                  }],
                })(
                  <Select
                    showSearch={true}
                    placeholder="请选择所属部门"
                    optionFilterProp="children"
                    onChange={this.departmentId}
                  >
                    {department.map((d) => {
                      return <SelectOption key={d.id}>{d.departmentName}</SelectOption>
                    })}
                  </Select>
                )}
            </FormItem>
            <FormItem
              label="用户名"
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 15 }}
            >
              {getFieldDecorator('loginName', {
                  rules: [{
                    required: true,
                    message: '请输入用户名',
                  }],
                })(

                  <Input placeholder="请请输入用户名" />
                )}
            </FormItem>
            <FormItem
              label="手机"
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 15 }}
            >
              {getFieldDecorator('phone', {
                  rules: [{
                    required: true,
                    message: '请输入手机',
                  }],
                })(

                  <Input placeholder="请输入手机" />
                )}
            </FormItem>
            <FormItem
              label="所属角色"
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 15 }}
              className={styles.roleListDiv}
            >
              {getFieldDecorator('roleId', {
                  rules: [{
                    required: true,
                    message: '请选择所属角色',
                  }],
                })(
                  <RadioGroup>
                    {
                      this.state.roles.map((role, i) => {
                        const j = i
                        return (
                          <RadioButton
                            key={j}
                            value={role.id}
                          >{role.roleName}
                          </RadioButton>
                        )
                      })
                    }
                  </RadioGroup>
                )}
            </FormItem>
            <FormItem
              label="备注"
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 15 }}
            >
              {getFieldDecorator('remark')(
                <Input type="textarea" rows={4} />
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

const UserAddUpComponent = Form.create()(UserAddUp)

export default UserAddUpComponent
