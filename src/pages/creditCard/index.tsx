/*
 * @Author: yanxiaodi 929213769@qq.com
 * @Date: 2018-10-21 21:31:28
 * @LastEditors: yanxiaodi 929213769@qq.com
 * @LastEditTime: 2018-10-21 21:31:28
 * @Description: 订单 - 页面
 */
import React from 'react'
import { Table, Input, Button, Drawer, Modal, Icon } from 'antd'
import { getRequest } from '../../utils/api'
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
          allowcode: '',
        },
        sorter: {},
      },
      screenItem: {
        allowcode: '',
      },
      loading: false,
      open: false,
      openUser: false,
      openOrder: false,
      openCar: false,

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
    screenItemOne.allowcode = e.target.value
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
      openUser: false,
      openOrder: false,
      openCar: false,
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
          title: '识别码',
          width: 150,
          dataIndex: 'allowcode',
          render(text, record) {
            return (
              <div>
                <a onClick={() => {
                  that.setState({
                    openOrder: true,
                    id: record.id
                  })
                }}>{text}</a>
              </div>
            )
          },
        },
        {
          title: '时间',
          width: 200,
          dataIndex: 'createtime',
        },
        {
          title: '用户',
          width: 150,
          dataIndex: 'username',
          render(text, record) {
            return (
              <div>
                <a onClick={() => {
                  that.setState({
                    openUser: true,
                    id: record.id
                  })
                }}>{text}</a>
              </div>
            )
          },
        },
        {
          title: '车辆',
          width: 150,
          dataIndex: 'vehicle',
          render(text, record) {
            return (
              <div>
                <a onClick={() => {
                  that.setState({
                    openCar: true,
                    id: record.id
                  })
                }}>{text}</a>
              </div>
            )
          },
        },
        {
          title: '总费用',
          width: 150,
          dataIndex: 'totalfee',
        },
        {
          title: '时长费用',
          width: 150,
          dataIndex: 'durationfee',
        },
        {
          title: '里程费用',
          width: 150,
          dataIndex: 'distancefee',
        },
        {
          title: '订单状态',
          width: 150,
          dataIndex: 'status',
          render(text) {
            return text === '0' ? '订单未开始' :
              text === '1' ?  '订单计费中' :
                text === '2' ?  '等待支付' :
                  text === '3' ?  '订单取消' :
                    text === '4' ?  '订单完成' : ''
          },
        },
        {
          title: '操作',
          width: 150,
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
      paramsOne.pagination.pageSize = 15
    }
    this.setState({ loading: true })
    const data = await getRequest('/api-biz/orders/list?page='
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

  render() {
    const that = this
    return (
      <div className={styles.sysUserWrap} style={{ minHeight: 'calc(100vh - 104px)' }}>
        <div>
          <Input prefix={<Icon type="search" />}
                 placeholder="搜索识别码"
                 style={{ width: 280, marginLeft: '10px' }}
                 value={this.state.screenItem.allowcode}
                 onChange={this.onChangeCustomerName}
                 onPressEnter={this.handleSearch}
          />
          <Button style={{ margin: '0 10px' }} type="primary" onClick={this.handleSearch}>搜索</Button>
        </div>
        <Screen
          callback={this.callbackScreen}
          columns={this.state.columns}
          filters={this.state.params.filters}
        />
        <Table
          style={{ marginTop: '20px' }}
          rowKey="id"
          scroll={{ x: 1500 }}
          columns={this.state.columns}
          dataSource={this.state.dataSource}
          pagination={this.state.pagination}
          loading={this.state.loading}
          onChange={this.handleTableChange}
        />
        <Modal
          title={this.state.record.id > 0 ? '编辑订单' : '添加订单'}
          style={{ top: 20 }}
          width={500}
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

        <Drawer
          title="用户信息"
          placement="right"
          closable={false}
          width={700}
          onClose={() => {this.setState({openUser: false})}}
          visible={this.state.openUser}
        >
          <p>用户信息...</p>
          <p>用户信息...</p>
          <p>用户信息...</p>
        </Drawer>

        <Drawer
          title="订单信息"
          placement="right"
          closable={false}
          width={700}
          onClose={() => {this.setState({openOrder: false})}}
          visible={this.state.openOrder}
        >
          <p>订单信息...</p>
          <p>订单信息...</p>
          <p>订单信息...</p>
        </Drawer>

        <Drawer
          title="车辆信息"
          placement="right"
          closable={false}
          width={700}
          onClose={() => {this.setState({openCar: false})}}
          visible={this.state.openCar}
        >
          <p>车辆信息...</p>
          <p>车辆信息...</p>
          <p>车辆信息...</p>
        </Drawer>

      </div>
    )
  }
}

export default Index
