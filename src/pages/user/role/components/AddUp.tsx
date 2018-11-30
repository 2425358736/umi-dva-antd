// 系统设置 - 角色添加删除
import React from 'react'
import { Tree, Button, Form, Input, Select, Icon, message, Row, Col } from 'antd'
import styled from 'styled-components'
import { postRequest } from '../../../../utils/api'

const TreeTreeNode = Tree.TreeNode
const FormItem = Form.Item

const MenuBox = styled.div`
  border: 1px solid #d9d9d9;
  word-wrap: break-word;
  border-radius: 4px;
  overflow-y: auto;
  overflow-x: auto;
  height: 363px;
`
class AddUp extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      perList: [],
      havePerList: [],
      departmentList: [],
    }
  }

  componentWillMount = () => {
    this.initial()
  }

  havePerList = per => {
    const havePerList1 = this.state.havePerList
    if (havePerList1.indexOf(per) >= 0) {
      havePerList1.splice(havePerList1.indexOf(per), 1)
    } else {
      havePerList1.push(per)
    }
    this.setState({
      havePerList: havePerList1,
    })
  }

  recursion = per => {
    return (
      <TreeTreeNode
        title={
          <Button
            size="small"
            style={
              this.state.havePerList.indexOf(per.id) >= 0
                ? {
                  backgroundColor: 'red',
                  color: 'antiquewhite',
                }
                : null
            }
            onClick={() => this.havePerList(per.id)}
          >
            <Icon
              style={{
                color:
                  this.state.havePerList.indexOf(per.id) >= 0
                    ? null
                    : per.perType === 2
                    ? '#fa9a32'
                    : per.perType === 3
                      ? '#1bb4b4'
                      : '#4290f7',
              }}
              type={per.perType === 2 ? 'tag' : per.perType === 3 ? 'pushpin-o' : 'appstore'}
            />
            {per.perName}
          </Button>
        }
        key={per.id}
      >
        {per.children.map(per1 => {
          return this.recursion(per1)
        })}
      </TreeTreeNode>
    )
  }

  initial = async () => {
    // 部门列表
    const department = await postRequest('/system/departmentListAll')
    // 权限列表
    const perList = await postRequest('/system/companyListPermission')
    const list = []
    const aa = per => {
      perList.data.forEach(per1 => {
        if (per1.parentId === per.id) {
          per.children.push(per1)
          aa(per1)
        }
      })
    }
    perList.data.forEach(per => {
      if (per.parentId === 0) {
        list.push(per)
        aa(per)
      }
    })
    this.setState({
      perList: list,
      departmentList: department.data,
    })

    // 修改
    if (this.props.id > 0) {
      // 角色拥有权限
      const havePerList = await postRequest('/system/rolePermissionList', {
        id: this.props.id,
      })
      // 角色信息
      const roleInfo = await postRequest('/system/getRole', {
        id: this.props.id,
      })
      const listArr = []
      havePerList.data.forEach(per => {
        listArr.push(per.id)
      })
      this.setState({
        havePerList: listArr,
      })
      this.props.form.setFieldsValue({
        departmentId: roleInfo.data.departmentId.toString(),
        roleName: roleInfo.data.roleName,
        roleNumber: roleInfo.data.roleNumber,
        remarks: roleInfo.data.remarks,
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
      const json = this.props.form.getFieldsValue()
      json.permissionVoListStr = this.state.havePerList
      let data = ''
      if (this.props.id > 0) {
        json.id = this.props.id
        data = await postRequest('/system/updateRole', json)
      } else {
        data = await postRequest('/system/insertRole', json)
      }
      message.success(`${data.message}`)
      this.props.callback({ type: 'submit' })
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
          <Row>
            <Col span={12}>
              <FormItem label="所属部门" labelCol={{ span: 6 }} wrapperCol={{ span: 16 }}>
                {getFieldDecorator('departmentId', {
                  rules: [
                    {
                      required: true,
                      message: '请选择所属部门',
                    },
                  ],
                })(
                  <Select showSearch={true} placeholder="请选择所属部门" optionFilterProp="children">
                    {this.state.departmentList.map(department => {
                      return (
                        <Select.Option key={department.id}>
                          {department.departmentName}
                        </Select.Option>
                      )
                    })}
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="角色名称" labelCol={{ span: 6 }} wrapperCol={{ span: 16 }}>
                {getFieldDecorator('roleName', {
                  rules: [
                    {
                      required: true,
                      message: '请填写角色名称',
                    },
                  ],
                })(<Input />)}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <FormItem label="角色编号" labelCol={{ span: 6 }} wrapperCol={{ span: 16 }}>
                {getFieldDecorator('roleNumber', {
                  rules: [
                    {
                      required: true,
                      message: '请填写角色编号',
                    },
                  ],
                })(<Input />)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="角色说明" labelCol={{ span: 6 }} wrapperCol={{ span: 16 }}>
                {getFieldDecorator('remarks', {
                  rules: [
                    {
                      required: true,
                      message: '请填写角色说明',
                    },
                  ],
                })(<Input />)}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <FormItem label="权限设置" labelCol={{ span: 3 }} wrapperCol={{ span: 20 }}>
                {getFieldDecorator('permissionVoList')(
                  <MenuBox>
                    <Tree showLine={true} defaultExpandAll={true}>
                      {this.state.perList.map(per => {
                        return this.recursion(per)
                      })}
                    </Tree>
                  </MenuBox>
                )}
              </FormItem>
            </Col>
          </Row>
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
const AddUpCom = Form.create()(AddUp)
export default AddUpCom
