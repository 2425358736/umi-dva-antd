// 详情
import React from 'react'
import { LocaleProvider, Col, Row } from 'antd'
import zhCN from 'antd/lib/locale-provider/zh_CN'
const styles = require('../../../components/Less/Detail.less')
import styled from 'styled-components'

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
    }
  }

  componentDidMount = async () => {
    this.setState({
      dataSource: this.props.record
    })
  }

  render() {
    return (
      <LocaleProvider locale={zhCN}>
          <div
            id="contractDetail"
            className={styles.containt}
            style={{ height: 'calc(100vh - 60px)' }}
          >
            <div className={styles.creditmess}>
              <DivBox>
                <CosTitle>客户用户名</CosTitle>
                <Cousnum>{this.state.dataSource.username}</Cousnum>
              </DivBox>
              <DivBox>
                <CosTitle>车辆识别码</CosTitle>
                <Cousnum>{this.state.dataSource.allowcode}</Cousnum>
              </DivBox>
              <DivBox>
                <CosTitle>内部车辆号</CosTitle>
                <Cousnum>{this.state.dataSource.vehicle}</Cousnum>
              </DivBox>
              <DivBox>
                <CosTitle>预定时间</CosTitle>
                <Cousnum>{this.state.dataSource.ordertime}</Cousnum>
              </DivBox>
              <DivBox>
                <CosTitle>订单状态</CosTitle>
                <Cousnum>{
                  this.state.dataSource.status === '0' ? '订单未开始' :
                    this.state.dataSource.status === '1' ? '订单计费中' :
                      this.state.dataSource.status === '2' ? '等待支付' :
                        this.state.dataSource.status === '3' ? '订单取消' :
                          this.state.dataSource.status === '4' ? '订单完成' : ''
            }</Cousnum>
              </DivBox>
            </div>

            <div className={styles.details}>
              <div className={styles.rentDetail} style={{ marginTop: '0' }}>
                <h3
                  className={styles.titleDiv}
                  style={{ textAlign: 'center', marginBottom: '20px' }}
                >
                  基本信息
                </h3>
                <div className={styles.itemValue2} style={{ padding: '0 20px' }}>
                  <Row style={{ marginTop: '10px' }}>
                    <Col span={8}>
                      <p className={styles.contractTitle}>车辆总费用</p>
                    </Col>
                    <Col span={8}>
                      <p className={styles.contractTitle}>订单里程（公里）</p>
                    </Col>
                    <Col span={8}>
                      <p className={styles.contractTitle}>订单时长（小时）</p>
                    </Col>
                    <Col span={8}>
                      <p className={styles.contractVal}>
                        {this.state.dataSource.totalfee}
                      </p>
                    </Col>
                    <Col span={8}>
                      <p className={styles.contractVal}>{this.state.dataSource.distance}</p>
                    </Col>
                    <Col span={8}>
                      <p className={styles.contractVal}>{this.state.dataSource.duration}</p>
                    </Col>
                  </Row>

                  <Row style={{ marginTop: '10px' }}>
                    <Col span={8}>
                      <p className={styles.contractTitle}>里程费用</p>
                    </Col>
                    <Col span={8}>
                      <p className={styles.contractTitle}>时长费用</p>
                    </Col>
                    <Col span={8}>
                      <p className={styles.contractTitle}>订单开始计费时间</p>
                    </Col>
                    <Col span={8}>
                      <p className={styles.contractVal}>
                        {this.state.dataSource.distancefee}
                      </p>
                    </Col>
                    <Col span={8}>
                      <p className={styles.contractVal}>{this.state.dataSource.durationfee}</p>
                    </Col>
                    <Col span={8}>
                      <p className={styles.contractVal}>{this.state.dataSource.starttime}</p>
                    </Col>
                  </Row>

                  <Row style={{ marginTop: '10px' }}>
                    <Col span={8}>
                      <p className={styles.contractTitle}>订单停止计费时间</p>
                    </Col>
                    <Col span={8}>
                      <p className={styles.contractTitle}>是否为预定</p>
                    </Col>
                    <Col span={8}>
                      <p className={styles.contractTitle}>是否要司机</p>
                    </Col>
                    <Col span={8}>
                      <p className={styles.contractVal}>
                        {this.state.dataSource.endtime}
                      </p>
                    </Col>
                    <Col span={8}>
                      <p className={styles.contractVal}>{this.state.dataSource.preordered === '0' ? '非预' : '预定'}</p>
                    </Col>
                    <Col span={8}>
                      <p className={styles.contractVal}>{this.state.dataSource.needdriver === '0' ? '不要司机' : '要司机'}</p>
                    </Col>
                  </Row>

                  <Row style={{ marginTop: '10px' }}>
                    <Col span={8}>
                      <p className={styles.contractTitle}>是否要搬运工</p>
                    </Col>
                    <Col span={8}>
                      <p className={styles.contractTitle}>需要司机数量</p>
                    </Col>
                    <Col span={8}>
                      <p className={styles.contractTitle}>需要搬运工数量</p>
                    </Col>
                    <Col span={8}>
                      <p className={styles.contractVal}>{this.state.dataSource.needworker === '0' ? '不要搬运' : '要搬运工'}</p>
                    </Col>
                    <Col span={8}>
                      <p className={styles.contractVal}>{this.state.dataSource.drivercount}</p>
                    </Col>
                    <Col span={8}>
                      <p className={styles.contractVal}>{this.state.dataSource.workercount}</p>
                    </Col>
                  </Row>
                </div>
              </div>
            </div>
          </div>
      </LocaleProvider>
    )
  }
}

export default Info
