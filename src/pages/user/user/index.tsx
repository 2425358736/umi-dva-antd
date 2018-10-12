// 用户列表
import React from 'react'
import { message, Table, Input, Button, Icon, Menu, Popconfirm, Dropdown, Modal } from 'antd'
import { post } from '../../../utils/api'
import Screen from '../../../components/Screen/Screen'
import UserAddUpComponent from './components/UserAddUp'
const styles = require('./user.less')

class SysUser extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      columns: [],
      dataSource: [],
      pagination: {
        showSizeChanger: true,
        showQuickJumper: true,
        pageSizeOptions: ['15', '30', '45'],
        defaultPageSize: 15,
      },
      params: {
        pagination: {},
        filters: {
          userName: '',
        },
        sorter: {},
      },
      screenItem: {
        userName: '',
      },
      loading: false,
      open: false,
      id: 0,
    }
  }
  componentDidMount = async () => {
    this.columnsUp()
    this.fetch({ pagination: {}, filters: {} })
  }

  /**
   * 更新客户姓名
   * @param e
   */
  onChangeCustomerName = (e) => {
    const screenItemOne = this.state.screenItem
    screenItemOne.userName = e.target.value
    this.setState({
      screenItem: screenItemOne,
    })
  }

  /**
   * 添加编辑后回调刷新
   * @param json
   */
  getContractInfo = (json) => {
    // console.log(json);
    if (json.type === 'submit' && this.state.id === 0) {
      const filters = JSON.parse(JSON.stringify(this.state.params.filters))
      for (const key in filters) {
        if (filters[key] !== null) {
          filters[key] = null
        }
      }
      this.handleTableChange({},
                             filters, {})
    } else if (json.type === 'submit' && this.state.id > 0) {
      this.handleTableChange(this.state.params.pagination,
                             this.state.params.filters, this.state.params.sorter)
    }
    this.setState({
      open: false,
      id: 0,
    })
  }
  /**
   * 更新表头
   * @returns {*}
   */
  columnsUp = () => {
    const that = this
    that.setState({
      columns: [
        {
          title: '所属部门',
          width: 150,
          dataIndex: 'departmentName',
        },
        {
          title: '用户名',
          width: 150,
          dataIndex: 'userName',
        },
        {
          title: '所属角色',
          width: 150,
          dataIndex: 'roleId',
          render(text, record) {
            return (record.roleName)
          },
        },
        {
          title: '手机',
          width: 150,
          dataIndex: 'phone',
        },
        {
          title: '账号状态',
          width: 200,
          column: 'loginFlag',
          columnStr: {0: '正常', 1: '关闭'},
          dataIndex: 'loginFlag',
          filters: [{
            text: '正常',
            value: 0,
          }, {
            text: '关闭',
            value: 1,
          }],
          filteredValue: that.state.params.filters.loginFlag || null,
          sorter: true,
          render(text) {
            return text === 0 ? '正常' : '关闭'
          },
        },
        {
          title: '创建时间',
          width: 150,
          dataIndex: 'loginDate',
          sorter: true,
        },
        {
          title: '备注',
          width: 200,
          dataIndex: 'remark',
        },
        {
          title: '操作',
          width: 350,
          dataIndex: 'opt',
          render(text, record) {
            return (
              <div>
                <a onClick={() => that.edit(record.id)}>编辑</a>
                <Popconfirm title="此操作将重置密码为cj123456，是否继续?" onConfirm={() => that.reset(record.id)}>
                  <a style={{marginLeft: '20px'}}>重置密码</a>
                </Popconfirm>
                <Popconfirm title="是否确认关闭该账号？" onConfirm={() => that.close(record.id)}>
                  <a style={{marginLeft: '20px'}}>关闭账号</a>
                </Popconfirm>
                <Popconfirm title="确定删除吗?" onConfirm={() => that.deleteDepartment(record.id)}>
                  <a style={{marginLeft: '20px'}}>删除</a>
                </Popconfirm>
              </div>
            )
          },
        },
      ],
    })
  }
  edit = async (id) => {
    this.setState({
      open: true,
      id,
    })
  }
  reset = async (id) => {
    const data = await post(
      '/system/updateUser',
      { id,
        passWord: 'lzq123456' },
    )
    await this.setState({
      id,
    })
    this.getContractInfo({type: 'submit'})
    message.success(data.message)
  }
  close = async (id) => {
    const data = await post(
      '/system/updateUser',
      { id,
        loginFlag: 2 }
    )
    await this.setState({
      id,
    })
    this.getContractInfo({type: 'submit'})
    message.success(data.message)
  }
  deleteDepartment = async (id) => {
    const data = await post(
      '/system/deleteSysUser',
      { id },
    )
    await this.setState({
      id,
    })
    this.getContractInfo({type: 'submit'})
    message.success(data.message)
  }
  /**
   * 点击搜索执行 跳转第一页
   */
  handleSearch = () => {
    const paramsOne = this.state.params
    paramsOne.filters = Object.assign(paramsOne.filters, this.state.screenItem)
    this.handleTableChange({},
                           paramsOne.filters, paramsOne.sorter)
  }
  /**
   * 分页触发
   * @param pagination
   * @param filters
   * @param sorter
   */
  handleTableChange = (pagination, filters, sorter) => {
    debugger
    const pager = { ...this.state.pagination }
    pager.current = pagination.current
    const params = {
      pagination,
      sorter,
      filters: Object.assign(this.state.params.filters, filters),
    }
    this.setState({
      pagination: pager,
      params,
    })
    this.columnsUp()
    this.fetch({ pagination: Object.assign(params.pagination,
                                           { field: sorter.field, order: sorter.order }),
      filters: params.filters })
  }
  /**
   * 请求数据
   * @param params
   * @returns {Promise.<void>}
   */
  fetch = async (params) => {
    const paramsOne = JSON.parse(JSON.stringify(params))
    if (paramsOne.pagination.field === null
      || typeof paramsOne.pagination.field === 'undefined' || paramsOne.pagination.field === '') {
      paramsOne.pagination.field = 'a.id'
      paramsOne.pagination.order = 'desc'
    }
    if (paramsOne.pagination.current === null
      || typeof paramsOne.pagination.current === 'undefined' || paramsOne.pagination.current === '') {
      paramsOne.pagination.current = 0
      paramsOne.pagination.pageSize = 15
    }
    this.setState({ loading: true })
    const data = await post('/user/userList', paramsOne)
    const paginationOne = this.state.pagination
    paginationOne.total = data.data.total
    this.setState({
      loading: false,
      dataSource: data.data.list,
      pagination: paginationOne,
    })
  }
  /**
   * 筛选标签回调
   * @param filters
   */
  callbackScreen = (filters) => {
    const screenItemOne = JSON.parse(JSON.stringify(this.state.screenItem))
    for (const key in filters) {
      if (key !== null) {
        for (const keyTwo in screenItemOne) {
          if (key.toString() === keyTwo.toString()) {
            screenItemOne[keyTwo] = filters[key]
          }
        }
      }
    }
    this.setState({
      screenItem: screenItemOne,
    })
    this.handleTableChange(this.state.params.pagination, filters, this.state.params.sorter)
    this.columnsUp()
  }
  /**
   * 添加事件
   */
  addCustomer = () => {
    this.setState({
      open: true,
      id: 0,
    })
  }
  render() {
    const that = this
    return (
      <div className={styles.sysUserWrap} style={{ minHeight: 'calc(100vh - 104px)' }}>
        <div>
          <Input prefix={<Icon type="search" />}
                 placeholder="搜索用户名"
                 style={{ width: 280, marginLeft: '10px' }}
                 value={this.state.screenItem.userName}
                 onChange={this.onChangeCustomerName}
                 onPressEnter={this.handleSearch} />
          <Button style={{ margin: '0 10px' }} type="primary" onClick={this.handleSearch}>搜索</Button>
          <Modal
            title={this.state.id > 0 ? '编辑账号' : '添加账号'}
            style={{ top: 20 }}
            width={500}
            visible={this.state.open}
            footer={null}
            onCancel={() => this.getContractInfo({ type: 'cancel' })}
            destroyOnClose={true}
          >
            <UserAddUpComponent
              callback={this.getContractInfo}
              id={this.state.id}
              department={[]}
            />
          </Modal>
          <div style={{ float: 'right', display: 'inline-block', cursor: 'pointer' }} onClick={this.addCustomer}>
            <Button type="primary" style={{padding: '0 15px'}}>+ 添加账号</Button>
          </div>
        </div>
        <Screen
          callback={this.callbackScreen}
          columns={this.state.columns}
          filters={this.state.params.filters}
        />
        <Table
          style={{ marginTop: '20px' }}
          rowKey="id"
          columns={this.state.columns}
          dataSource={this.state.dataSource}
          pagination={this.state.pagination}
          loading={this.state.loading}
          onChange={this.handleTableChange}
        />
      </div>
    )
  }
}

export default SysUser
