// 系统设置 - 菜单管理
import React from 'react'
import { Tree, Icon, Divider, Menu, Dropdown, message, Modal, Popconfirm } from 'antd'
import styled from 'styled-components'
import { postRequest } from '../../../utils/api'
import AddUp from './components/AddUp'
import Role from '../../user/role/index'

const MenuContent = styled.div`
    display: flex
    height: 100%
`

const MenuBox = styled.div`
  flex: 0.5;
  word-wrap: break-word;
`
const MenuBox1 = styled.div`
  flex: 1.5;
`
const style = {
  width: '110%',
  height: '25px',
  textAlign: 'center',
  border: '1px solid #c5b4b4',
  lineHeight: '25px',
}

let switch1 = true
class SysDepartment extends React.Component {
  Caidan = (department) => {
    return  (
      <Menu>
        <Menu.Item key="1">
          <a onClick={() => this.updateState(3, department)}>添加下级部门</a>
        </Menu.Item>
        <Menu.Item key="2">
          <a onClick={() => this.updateState(2, department)}>编辑部门</a>
        </Menu.Item>
        <Menu.Item key="3">
          <Popconfirm
            title="确定删除吗？"
            onConfirm={() => {
              this.deleteMenu(department)
            }}
          >
          <a>删除部门</a>
          </Popconfirm>
        </Menu.Item>
      </Menu>
    )
  }

  CaidanTwo = (
    <Menu>
      <Menu.Item key="1">
        <a onClick={() => this.updateState(3, {})}>添加下级部门</a>
      </Menu.Item>
    </Menu>
  )

  constructor(props) {
    super(props)
    this.state = {
      departmentInfo: {},
      DepartmentList: [],
      roleList: [],
      open: false,
      openInfo: false,
      state: 1, // 1详情 2编辑 3添加
    }
  }

  componentDidMount() {
    this.initialization()
  }

  deleteMenu = async ( department ) => {
    const data = await postRequest('/system/deleteDepartment', {
      id: department.id,
      delFlag: 1,
    })
    message.success(data.message)
    if (data.code === 0) {
      this.initialization()
    }
  }

  updateState = (value, department) => {
    switch1 = false
    let departmentInfo = value === 2 ? department : {parentName: department.departmentName, parentId: department.id}
    this.setState({
      departmentInfo,
      state: value,
      open: true,
    })
  }

  initialization = async () => {
    switch1 = true
    let DepartmentList = await postRequest('/system/departmentListAllTree')
    DepartmentList = DepartmentList.data
    this.setState({
      state: 1, // 1详情 2编辑 3添加
      DepartmentList,
    })
  }

  info = departmentInfo => {
    if (switch1) {
      this.setState({
        state: 1,
        departmentInfo
      })
    }
  }

  recursion(DepartmentList, i) {
    const arr = []
    let j = 0
    DepartmentList.forEach(department => {
        arr[j] = (
          <Tree.TreeNode
            title={
              <div style={style} onClick={() => this.info(department)}>
                <Icon
                  type="home"
                />
                &nbsp;&nbsp;
                {department.departmentName}
                &nbsp;&nbsp;
                <Dropdown trigger={['click']} overlay={this.Caidan(department)} placement="bottomLeft">
                  <Icon type="caret-down" />
                </Dropdown>
              </div>
            }
            key={department.id}
          >
            {this.recursion(department.children, department.id)}
          </Tree.TreeNode>
        )
        j += 1
    })
    return arr
  }

  /**
   * 添加后回调刷新
   * @param json
   */
  getContractInfo = json => {
    switch1 = true
    if (json.type === 'submit') {
      this.initialization()
    }
    this.setState({
      open: false,
      openInfo: false,
      departmentInfo: {},
    })
  }

  render() {
    return (
      <div>
        <MenuContent>
          <MenuBox>
            <h2
              style={{
                fontWeight: 600,
              }}
            >
              部门树结构
            </h2>
            <hr
              style={{
                color: '#EBEBEB',
              }}
            />
            <Tree showLine={true} defaultExpandAll={true}>
              <Tree.TreeNode
                title={
                  <div style={style} onClick={() => this.info({})}>
                    <Icon type="folder" />
                    &nbsp;&nbsp;部门结构&nbsp;&nbsp;
                    <Dropdown trigger={['click']} overlay={this.CaidanTwo} placement="bottomLeft">
                      <Icon type="caret-down" />
                    </Dropdown>
                  </div>
                }
                key="0-0"
              >
                {this.recursion(this.state.DepartmentList, 0)}
              </Tree.TreeNode>
            </Tree>
            <Modal
              title={this.state.state === 2 ? '编辑部门' : '添加部门'}
              style={{ top: 20 }}
              width={500}
              visible={this.state.open}
              footer={null}
              onCancel={() => this.getContractInfo({ type: 'cancel' })}
              destroyOnClose={true}
            >
              <AddUp
                callback={this.getContractInfo}
                id={this.state.departmentInfo.id}
                parentName={this.state.departmentInfo.parentName ? this.state.departmentInfo.parentName : '部门结构'}
                parentId={this.state.departmentInfo.parentId ? this.state.departmentInfo.parentId : 0}
              />
            </Modal>
          </MenuBox>
          <Divider type="vertical" style={{ height: '38em' }} />
          <MenuBox1>
            <h2
              style={{
                fontWeight: 600,
              }}
            >
              角色列表
            </h2>
            <hr
              style={{
                color: '#EBEBEB',
              }}
            />
          <Role
            departmentId={this.state.departmentInfo.id}
          />
          </MenuBox1>
        </MenuContent>
      </div>
    )
  }
}

export default SysDepartment
