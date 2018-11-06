// 列表
import React from 'react'
import { message, Drawer, Table, Input, Button, Popconfirm, Modal, Icon } from 'antd'
import { getRequest, deleteRequest } from '../../utils/api'
import Screen from '../../components/Screen/Screen'
import AddUp from './components/AddUp'
const styles = require('./index.less')

class Index extends React.Component {
  constructor(props) {
    super(props)
    /**
     *
     * @type
     * {
     *  {
     *    record: {};  当前变更的对象
     *    columns: Array;  列表头部配置
     *    dataSource: Array;  数据源
     *    pagination: {  分页组件参数
     *      showSizeChanger: boolean; 是否可以改变 pageSize
     *      showQuickJumper: boolean; 是否可以快速跳转至某页
     *      pageSizeOptions: [string , string , string , string]; 指定每页可以显示多少条
     *      defaultPageSize: number 默认的每页条数
     *    };
     *    params: { 后端交互参数集合
     *      pagination: {}; 分页参数
     *      filters: {}; 查询参数
     *      sorter: {} 排序参数
     *    };
     *    screenItem: {}; 搜索框参数
     *    loading: boolean; 加载等待
     *    open: boolean Modal打开组件
     *   }
     * }
     */
    this.state = {
      record: {},
      columns: [],
      dataSource: [],
      pagination: {
        showSizeChanger: true,
        showQuickJumper: true,
        pageSizeOptions: ['10', '15', '30', '45'],
        defaultPageSize: 10,
      },
      params: {
        pagination: {},
        filters: {
          username: '',
        },
        sorter: {},
      },
      screenItem: {
        username: '',
      },
      loading: false,
      open: false,
      openInfo: false,
    }
  }
  componentDidMount = async () => {
    this.columnsUp()
    this.fetch({ pagination: {}, filters: {} })
  }

  /**
   * 更新搜索框
   * @param e
   */
  onChangeCustomerName = (e) => {
    const screenItemOne = this.state.screenItem
    screenItemOne.username = e.target.value
    this.setState({
      screenItem: screenItemOne,
    })
  }

  /**
   * 添加编辑后回调刷新
   * @param json
   */
  getContractInfo = (json) => {
    if (json.type === 'submit' && !this.state.record.id) {
      const filters = JSON.parse(JSON.stringify(this.state.params.filters))
      for (const key in filters) {
        if (filters[key] !== null) {
          filters[key] = null
        }
      }
      this.handleTableChange({},
                             filters, {})
    } else if (json.type === 'submit' && this.state.record.id > 0) {
      this.handleTableChange(this.state.params.pagination,
                             this.state.params.filters, this.state.params.sorter)
    }
    this.setState({
      open: false,
      openInfo: false,
      record: {},
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
          title: '姓名',
          width: 150,
          dataIndex: 'username',
          render(text) {
            return (<a onClick={() => { that.setState({openInfo: true})}}>{text}</a>)
          },
        },
        {
          title: '注册日期',
          width: 200,
          dataIndex: 'createtime',
        },
        {
          title: '手机号',
          width: 150,
          dataIndex: 'mobile',
        },
        {
          title: '驾照',
          width: 150,
          dataIndex: 'drivelicense',
        },
        {
          title: '出生日期',
          width: 200,
          dataIndex: 'birthday',
        },
        {
          title: '驾照到期日期',
          width: 200,
          dataIndex: 'licenseexpirydate',
        },
        {
          title: '准驾车型',
          width: 150,
          dataIndex: 'licensetype',
        },
        {
          title: '剩余积分',
          width: 150,
          dataIndex: 'licensepoints',
        },
        {
          title: '状态',
          width: 150,
          dataIndex: 'status',
          render(text) {
            return text === '1' ? '已注册' : '待审核'
          },
        },
        {
          title: '操作',
          width: 350,
          dataIndex: 'opt',
          render(text, record) {
            return (
              <div>
                <a onClick={() => that.edit(record)}>编辑</a>
              </div>
            )
          },
        },
      ],
    })
  }
  /**
   * 编辑
   * @param record 编辑的对象
   * @returns {Promise<void>}
   */
  edit = async (record) => {
    this.setState({
      open: true,
      record,
    })
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
      paramsOne.pagination.pageSize = 10
    }
    this.setState({ loading: true })
    const data = await getRequest('/api-biz/renter/list?page='
      + paramsOne.pagination.current + '&limit=' + paramsOne.pagination.pageSize)
    const paginationOne = this.state.pagination
    paginationOne.total = data.count
    this.setState({
      loading: false,
      dataSource: data.data,
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
  // addCustomer = () => {
  //   this.setState({
  //     open: true,
  //   })
  // }
  render() {
    const that = this
    return (
      <div className={styles.sysUserWrap} style={{ minHeight: 'calc(100vh - 104px)' }}>
        <div>
          <Input prefix={<Icon type="search" />}
                 placeholder="搜索用户名"
                 style={{ width: 280, marginLeft: '10px' }}
                 value={this.state.screenItem.username}
                 onChange={this.onChangeCustomerName}
                 onPressEnter={this.handleSearch}
          />
          <Button style={{ margin: '0 10px' }} type="primary" onClick={this.handleSearch}>搜索</Button>
          <Modal
            title={this.state.record.id > 0 ? '编辑用户' : '添加用户'}
            style={{ top: 20 }}
            width={700}
            visible={this.state.open}
            footer={null}
            onCancel={() => this.getContractInfo({ type: 'cancel' })}
            destroyOnClose={true}
          >
            <AddUp
              callback={this.getContractInfo}
              record={this.state.record}
            />
          </Modal>
          {/*<div style={{ float: 'right', display: 'inline-block', cursor: 'pointer' }} onClick={this.addCustomer}>*/}
            {/*<Button type="primary" style={{padding: '0 15px'}}>+ 添加用户</Button>*/}
          {/*</div>*/}
        </div>
        <Screen
          callback={this.callbackScreen}
          columns={this.state.columns}
          filters={this.state.params.filters}
        />
        <Table
          style={{ marginTop: '20px' }}
          rowKey="id"
          scroll={{ x: 1500  }}
          columns={this.state.columns}
          dataSource={this.state.dataSource}
          pagination={this.state.pagination}
          loading={this.state.loading}
          onChange={this.handleTableChange}
        />

        <Drawer
          title="用户信息"
          placement="right"
          closable={false}
          width={700}
          onClose={() => {this.setState({openInfo: false})}}
          visible={this.state.openInfo}
          destroyOnClose={true}
        >
          <p>用户信息...</p>
          <p>用户信息...</p>
          <p>用户信息...</p>
        </Drawer>
      </div>
    )
  }
}

export default Index
