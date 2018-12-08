// 列表
import React from 'react'
import { message, Table, Input, Button, Icon, Divider, Popconfirm, Modal, Drawer } from 'antd'
import { postRequest, jsonString, exportExcel } from 'utils/api'
import Screen from '../../../components/Screen/Screen'
const styles = require('./index.less')
import AddUp from './components/AddUp'
import Info from './components/Info'

let switch1 = true
class Role extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      department: [],
      columns: [],
      dataSource: [],
      pagination: {
        showSizeChanger: true,
        showQuickJumper: true,
        pageSizeOptions: ['5', '15', '30', '45'],
        defaultPageSize: 5,
      },
      params: {
        pagination: {},
        filters: {
          roleName: '',
        },
        sorter: {},
      },
      screenItem: {
        roleName: '',
      },
      loading: false,
      id: 0,
      open: false,
      openInfo: false,
    }
  }

  componentDidMount = async () => {
    const departmentList = await postRequest('/system/departmentListAll')
    departmentList.data.forEach((department) => {
      department.text = department.departmentName
      department.value = department.id
    })
    this.setState({
      department: departmentList.data,
    })
    this.columnsUp()
    this.fetch({ pagination: {}, filters: {} })
  }

  componentWillReceiveProps = (Props) => {
    const paramsOne = this.state.params
    if (Props.departmentId > 0) {
      paramsOne.filters = Object.assign(paramsOne.filters, {departmentId: [Props.departmentId.toString()]})
      this.handleTableChange({}, paramsOne.filters, paramsOne.sorter)
    } else {
      paramsOne.filters = Object.assign(paramsOne.filters, {departmentId: []})
      this.handleTableChange({}, paramsOne.filters, paramsOne.sorter)
    }
  }
  /**
   * 更新输入框搜索
   * @param e
   */
  onChangeCustomerName = e => {
    const screenItemOne = this.state.screenItem
    screenItemOne.roleName = e.target.value
    this.setState({
      screenItem: screenItemOne,
    })
  }

  /**
   * 添加后回调刷新
   * @param json
   */
  getContractInfo = json => {
    switch1 = true
    if (json.type === 'submit' && this.state.id === 0) {
      const filters = JSON.parse(JSON.stringify(this.state.params.filters))
      for (const key in filters) {
        if (filters[key] !== null) {
          filters[key] = null
        }
      }
      this.handleTableChange({}, filters, {})
    } else if (json.type === 'submit' && this.state.id > 0) {
      this.handleTableChange(
        this.state.params.pagination,
        this.state.params.filters,
        this.state.params.sorter
      )
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
    this.setState({
      columns: [
        {
          title: '序号',
          width: 100,
          dataIndex: 'id',
          column: 'id',
          render(text, record, index) {
            let page =
              (that.state.params.pagination.current - 1) * that.state.params.pagination.pageSize
            if (isNaN(page)) {
              page = 0
            }
            return <span>{page + index + 1}</span>
          },
        },
        {
          title: '所属部门',
          width: 150,
          column: 'departmentName',
          dataIndex: 'departmentId',
          filters: this.state.department,
          filteredValue: that.state.params.filters.departmentId || null,
          render(text, record) {
            return (record.departmentName)
          },
        },
        {
          title: '角色名称',
          width: 100,
          column: 'roleName',
          dataIndex: 'roleName',
        },
        {
          title: '角色编号',
          width: 100,
          column: 'roleNumber',
          dataIndex: 'roleNumber',
        },
        {
          title: '操作',
          width: 200,
          dataIndex: 'opt',
          render(text, record) {
            return (
              <div>
                <a onClick={() => that.edit(record.id)}>编辑</a>
                <Divider type="vertical" />
                <Popconfirm
                  title="确定删除吗?"
                  onConfirm={() => {
                    that.deleteDepartment(record.id)
                  }}
                >
                  <a
                    onClick={() => {
                      switch1 = false
                    }}
                  >
                    删除
                  </a>
                </Popconfirm>
              </div>
            )
          },
        },
      ],
    })
  }

  // 修改
  edit = async id => {
    switch1 = false
    this.setState({
      open: true,
      id,
    })
  }

  deleteDepartment = async id => {
    switch1 = false
    const data = await postRequest('/system/deleteRole', { id })
    await this.setState({
      id,
    })
    this.getContractInfo({ type: 'submit' })
    message.success(data.message)
  }

  /**
   * 点击搜索执行 跳转第一页
   */
  handleSearch = () => {
    const paramsOne = this.state.params
    paramsOne.filters = Object.assign(paramsOne.filters, this.state.screenItem)
    this.handleTableChange({}, paramsOne.filters, paramsOne.sorter)
  }

  /**
   * 分页触发
   * @param pagination
   * @param filters
   * @param sorter
   */
  handleTableChange = (pagination, filters, sorter) => {
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
    this.fetch({
      pagination: Object.assign(params.pagination, { field: sorter.field, order: sorter.order }),
      filters: params.filters,
    })
  }

  /**
   * 请求数据
   * @param params
   * @returns {Promise.<void>}
   */
  fetch = async params => {
    const paramsOne = JSON.parse(JSON.stringify(params))
    jsonString(paramsOne.filters)
    if (
      paramsOne.pagination.field === null ||
      typeof paramsOne.pagination.field === 'undefined' ||
      paramsOne.pagination.field === ''
    ) {
      paramsOne.pagination.field = 'a.id'
      paramsOne.pagination.order = 'desc'
    }
    if (
      paramsOne.pagination.current === null ||
      typeof paramsOne.pagination.current === 'undefined' ||
      paramsOne.pagination.current === ''
    ) {
      paramsOne.pagination.current = 0
      paramsOne.pagination.pageSize = 15
    }
    this.setState({ loading: true })
    const data = await postRequest('/system/roleList', paramsOne)
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
  callbackScreen = filters => {
    const screenItemOne = JSON.parse(JSON.stringify(this.state.screenItem))
    /* eslint-disable */
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
      <div className={styles.sysUserWrap}>
        <div>
          <Button
            onClick={() => {
              exportExcel('/system/sysUserList', this.state.params, this.state.columns)
            }}
            style={{ backgroundColor: 'rgb(243, 243, 243)' }}
          >
            导出
          </Button>
          <Input
            prefix={<Icon type="search" />}
            placeholder="搜索角色名"
            style={{ width: 280, marginLeft: '10px' }}
            value={this.state.screenItem.roleName}
            onChange={this.onChangeCustomerName}
            onPressEnter={this.handleSearch}
          />
          <Button style={{ margin: '0 10px' }} type="primary" onClick={this.handleSearch}>
            搜索
          </Button>
          <Modal
            title={this.state.id > 0 ? '编辑角色' : '添加角色'}
            style={{ top: 20 }}
            width={700}
            visible={this.state.open}
            footer={null}
            onCancel={() => this.getContractInfo({ type: 'cancel' })}
            destroyOnClose={true}
          >
            <AddUp
              callback={this.getContractInfo}
              id={this.state.id}
              department={this.state.department}
            />
          </Modal>
          <div
            style={{ float: 'right', display: 'inline-block', cursor: 'pointer' }}
            onClick={this.addCustomer}
          >
            <Button type="primary" style={{ padding: '0 15px' }}>
              + 添加角色
            </Button>
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
          onRow={record => {
          //   return {
          //     onClick: async () => {
          //       if (switch1) {
          //         await that.setState({
          //           id: record.id,
          //         })
          //         this.setState({
          //           openInfo: true,
          //         })
          //       }
          //     },
          //   }
          }}
        />
        <Drawer
          title="角色详情"
          placement="right"
          width="800px"
          closable={false}
          onClose={() => {
            this.setState({
              openInfo: false,
            })
          }}
          visible={this.state.openInfo}
          destroyOnClose={true}
        >
          <Info id={this.state.id} />
        </Drawer>
      </div>
    )
  }
}

export default Role
