// 系统设置 - 菜单管理
import React from 'react'
import { Tree, Button, Icon, Menu, Dropdown, Form, Input, Radio, message } from 'antd'
import styled from 'styled-components'
import styles from '../../../components/Less/List.less'
import { postRequest } from '../../../utils/api'

const FormItem = Form.Item
const RadioGroup = Radio.Group

const MenuContent = styled.div`
    display: flex
    height: 100%
`

const MenuBox = styled.div`
  flex: 1;
  border: 1px solid #333;
  word-wrap: break-word;
  overflow-y: scroll;
  overflow-x: scroll;
`
const MenuBox1 = styled.div`
  flex: 1;
  border: 1px solid #333;
`
const style = {
  width: '110%',
  height: '25px',
  textAlign: 'center',
  border: '1px solid #c5b4b4',
  lineHeight: '25px',
}

let switch1 = true
class SysPermission extends React.Component {
  Caidan = (per) => {
   return  (
      <Menu>
        <Menu.Item key="1">
          <a onClick={() => this.updateState(3, per)}>添加下级目录</a>
        </Menu.Item>
        <Menu.Item key="2">
          <a onClick={() => this.updateState(2, per)}>编辑菜单</a>
        </Menu.Item>
        <Menu.Item key="3">
          <a onClick={() => this.deleteMenu(per)}>删除菜单</a>
        </Menu.Item>
      </Menu>
    )
  }

  CaidanTwo = (
    <Menu>
      <Menu.Item key="1">
        <a onClick={() => this.updateState(3)}>添加下级目录</a>
      </Menu.Item>
    </Menu>
  )

  constructor(props) {
    super(props)
    this.state = {
      perInfo: {},
      PerList: [],
      id: 0,
      state: 1, // 1详情 2编辑 3添加
    }
  }

  componentDidMount() {
    this.initialization()
  }

  deleteMenu = async ( per ) => {
    const data = await postRequest('/system/updatePer', {
      id: per.id,
      delFlag: 1,
    })
    message.success(data.message)
    if (data.code === 0) {
      this.initialization()
    }
  }

  updateState = (value, per) => {
    switch1 = false
    let perInfo = per
    this.setState({
      perInfo,
    })
    if (value === 2) {
      this.setState({
        state: value,
      })
      this.props.form.setFieldsValue({
        perName: perInfo.perName,
        permissionCode: perInfo.permissionCode,
        perType: perInfo.perType,
        perUrl: perInfo.perUrl,
        perImg: perInfo.perImg,
        sort: perInfo.sort,
        parentName: perInfo.parentName,
      })
    } else {
      this.props.form.resetFields()
      this.setState({
        state: value,
      })
      this.props.form.setFieldsValue({
        parentName: perInfo.perName,
      })
    }
  }

  handleButtonClick = id => {
    this.setState({
      id,
    })
  }

  initialization = async () => {
    switch1 = true
    let PerList = await postRequest('/system/perListAll')
    PerList = PerList.data
    this.setState({
      state: 1, // 1详情 2编辑 3添加
      PerList,
    })
  }

  info = perInfo => {
    if (switch1) {
      this.setState({
        state: 1,
      })
      this.props.form.setFieldsValue({
        perName: perInfo.perName,
        permissionCode: perInfo.permissionCode,
        perType: perInfo.perType,
        perUrl: perInfo.perUrl,
        perImg: perInfo.perImg,
        sort: perInfo.sort,
        parentName: perInfo.parentName,
      })
    }
  }

  Preservation = async () => {
    let adopt = false
    this.props.form.validateFields(err => {
      if (err) {
        adopt = false
      } else {
        adopt = true
      }
    })
    if (adopt) {
      let json = this.props.form.getFieldsValue()
      let i = 0
      if (this.state.state === 3) {
        json.parentId = this.state.id
        const data = await postRequest('/system/insertPer', json)
        i = data.code
        message.success(data.message)
      } else if (this.state.state === 2) {
        json.id = this.state.id
        this.state.PerList.forEach(per => {
          if (per.id === this.state.id) {
            json = Object.assign(per, json)
          }
        })
        const data = await postRequest('/system/updatePer', json)
        i = data.code
        message.success(data.message)
      }
      if (i === 0) {
        this.initialization()
      }
    }
  }

  recursion(PerList, i) {
    const arr = []
    let j = 0
    PerList.forEach(per => {
      if (per.parentId === i) {
        arr[j] = (
          <Tree.TreeNode
            title={
              <div style={style} onClick={() => this.info(per)}>
                <Icon
                  type={per.perType === 2 ? 'tag' : per.perType === 3 ? 'pushpin-o' : 'appstore'}
                />
                &nbsp;&nbsp;
                {per.perName}
                &nbsp;&nbsp;
                <Dropdown trigger={['click']} overlay={this.Caidan(per)} placement="bottomLeft">
                  <Icon onClick={this.handleButtonClick.bind(this, per.id)} type="caret-down" />
                </Dropdown>
              </div>
            }
            key={per.id}
          >
            {this.recursion(per.children, per.id)}
          </Tree.TreeNode>
        )
        j += 1
      }
    })
    return arr
  }

  render() {
    const { getFieldDecorator } = this.props.form
    return (
      <div className={styles.sysUserWrap} style={{ minHeight: 'calc(100vh - 104px)' }}>
        <MenuContent>
          <MenuBox>
            <Tree showLine={true} defaultExpandAll={true}>
              <Tree.TreeNode
                title={
                  <div style={style}>
                    <Icon type="folder" />
                    &nbsp;&nbsp;菜单结构&nbsp;&nbsp;
                    <Dropdown trigger={['click']} overlay={this.CaidanTwo} placement="bottomLeft">
                      <Icon onClick={this.handleButtonClick.bind(this, 0)} type="caret-down" />
                    </Dropdown>
                  </div>
                }
                key="0-0"
              >
                {this.recursion(this.state.PerList, 0)}
              </Tree.TreeNode>
            </Tree>
          </MenuBox>
          <MenuBox1>
            <h2
              style={{
                marginLeft: '7%',
                fontWeight: 600,
              }}
            >
              {this.state.state === 1
                ? '权限详情'
                : this.state.state === 2
                  ? '编辑权限'
                  : '添加权限'}
            </h2>
            <hr
              style={{
                color: '#EBEBEB',
                width: '90%',
                marginLeft: '5%',
              }}
            />
            <Form style={{ marginTop: 20 }} layout="horizontal">
              <FormItem label="权限名称" labelCol={{ span: 5 }} wrapperCol={{ span: 15 }}>
                {getFieldDecorator('perName', {
                  rules: [
                    {
                      required: true,
                      message: '请输入权限名称!',
                    },
                  ],
                })(<Input disabled={this.state.state === 1} placeholder="请输入权限名称" />)}
              </FormItem>
              <FormItem label="权限标识" labelCol={{ span: 5 }} wrapperCol={{ span: 15 }}>
                {getFieldDecorator('permissionCode', {
                  rules: [
                    {
                      required: true,
                      message: '请输入权限标识!',
                    },
                  ],
                })(<Input disabled={this.state.state === 1} placeholder="请输入权限标识" />)}
              </FormItem>
              <FormItem label="权限级别" labelCol={{ span: 5 }} wrapperCol={{ span: 15 }}>
                {getFieldDecorator('perType', {
                  rules: [
                    {
                      required: true,
                      message: '请选择权限级别!',
                    },
                  ],
                })(
                  <RadioGroup disabled={this.state.state === 1}>
                    <Radio value={1}>目录</Radio>
                    <Radio value={2}>页面</Radio>
                    <Radio value={3}>按钮</Radio>
                  </RadioGroup>
                )}
              </FormItem>
              <FormItem label="权限地址" labelCol={{ span: 5 }} wrapperCol={{ span: 15 }}>
                {getFieldDecorator('perUrl')(
                  <Input disabled={this.state.state === 1} placeholder="请输入权限地址" />
                )}
              </FormItem>
              <FormItem label="图标" labelCol={{ span: 5 }} wrapperCol={{ span: 15 }}>
                {getFieldDecorator('perImg')(<Input disabled={this.state.state === 1} />)}
              </FormItem>
              <FormItem label="排列顺序" labelCol={{ span: 5 }} wrapperCol={{ span: 15 }}>
                {getFieldDecorator('sort')(<Input disabled={this.state.state === 1} />)}
              </FormItem>
              <FormItem label="父级菜单" labelCol={{ span: 5 }} wrapperCol={{ span: 15 }}>
                {getFieldDecorator('parentName')(<Input disabled={true} />)}
              </FormItem>
              {this.state.state !== 1 && (
                <div>
                  <Button
                    onClick={() => {
                      switch1 = true
                      this.info(this.state.perInfo)
                    }}
                    type="primary"
                    style={{ marginLeft: '25%' }}
                  >
                    取消
                  </Button>
                  <Button onClick={this.Preservation} type="primary" style={{ marginLeft: '25%' }}>
                    保存
                  </Button>
                </div>
              )}
            </Form>
          </MenuBox1>
        </MenuContent>
      </div>
    )
  }
}
const SysPermissionCom = Form.create()(SysPermission)

export default SysPermissionCom
