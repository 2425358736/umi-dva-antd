// 详情
import React from 'react'
import { Spin, Icon, LocaleProvider, Modal } from 'antd'
import zhCN from 'antd/lib/locale-provider/zh_CN'
import styled from 'styled-components'
import { postRequest } from '../../../../utils/api'
import UserAddUp from './AddUp'

const styles = require('../../../../components/Less/Detail.less')

const DivBox = styled.div`
  flex: 1;
  border-right: 1px solid #fff;
`
const Cousnum = styled.p`
  font-size: 20px;
  color: #fff;
  font-weight: 600;
  margin-bottom: 0;
`
const CosTitle = styled.p`
  font-size: 14px;
  color: #fff;
  margin-bottom: 0;
`

class Info extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      dataSource: {},
      loading: false,
      open: false,
    }
  }

  componentDidMount = async () => {
    this.setState({
      loading: true,
    })
    // 查询信息
    const data = await postRequest('/system/getUser', {
      id: this.props.id,
    })
    this.setState({
      dataSource: data.data,
      loading: false,
    })
  }

  edit = () => {
    this.setState({
      open: true,
    })
  }

  render() {
    return (
      <LocaleProvider locale={zhCN}>
        <Spin spinning={this.state.loading}>
          <div
            id="contractDetail"
            className={styles.containt}
            style={{ height: 'calc(100vh - 60px)' }}
          >
            <div className={styles.creditInfor}>
              <div>
                <h1 className={styles.customer}>{this.state.dataSource.assetsName}</h1>
                <div className={styles.buttons}>
                  <span style={{ cursor: 'pointer' }} onClick={this.edit}>
                    <Icon className={styles.iconStyle} type="printer" />
                    编辑
                  </span>
                </div>
              </div>
            </div>
            <div className={styles.creditmess}>
              <DivBox>
                <CosTitle>所属部门</CosTitle>
                <Cousnum>{this.state.dataSource.departmentName}</Cousnum>
              </DivBox>
              <DivBox>
                <CosTitle>所属角色</CosTitle>
                <Cousnum>{this.state.dataSource.roleName}</Cousnum>
              </DivBox>
              <DivBox>
                <CosTitle>手机号</CosTitle>
                <Cousnum>{this.state.dataSource.phone}</Cousnum>
              </DivBox>
            </div>
          </div>
          <Modal
            title="编辑部门"
            style={{ top: 20 }}
            width={850}
            visible={this.state.open}
            footer={null}
            zIndex={1010}
            onCancel={() => {
              this.setState({
                open: false,
              })
            }}
            destroyOnClose={true}
          >
            <UserAddUp
              id={this.props.id}
              callback={() => {
                this.setState({
                  open: false,
                })
                this.componentDidMount()
              }}
            />
          </Modal>
        </Spin>
      </LocaleProvider>
    )
  }
}

export default Info
