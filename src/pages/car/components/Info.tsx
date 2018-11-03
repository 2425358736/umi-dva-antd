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
                <CosTitle>车牌编码</CosTitle>
                <Cousnum>{this.state.dataSource.qrcode}</Cousnum>
              </DivBox>
              <DivBox>
                <CosTitle>车牌号</CosTitle>
                <Cousnum>{this.state.dataSource.license}</Cousnum>
              </DivBox>
              <DivBox>
                <CosTitle>车架号</CosTitle>
                <Cousnum>{this.state.dataSource.serialno}</Cousnum>
              </DivBox>
              <DivBox>
                <CosTitle>购置时间</CosTitle>
                <Cousnum>{this.state.dataSource.buydate}</Cousnum>
              </DivBox>
              <DivBox>
                <CosTitle>颜色</CosTitle>
                <Cousnum>{this.state.dataSource.color}</Cousnum>
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
                      <p className={styles.contractTitle}>品牌</p>
                    </Col>
                    <Col span={8}>
                      <p className={styles.contractTitle}>型号</p>
                    </Col>
                    <Col span={8}>
                      <p className={styles.contractTitle}>车系</p>
                    </Col>
                    <Col span={8}>
                      <p className={styles.contractVal}>
                        {this.state.dataSource.brand}
                      </p>
                    </Col>
                    <Col span={8}>
                      <p className={styles.contractVal}>{this.state.dataSource.model}</p>
                    </Col>
                    <Col span={8}>
                      <p className={styles.contractVal}>{this.state.dataSource.lineno}</p>
                    </Col>
                  </Row>

                  <Row style={{ marginTop: '10px' }}>
                    <Col span={8}>
                      <p className={styles.contractTitle}>每公里收费</p>
                    </Col>
                    <Col span={8}>
                      <p className={styles.contractTitle}>起步距离（公里）</p>
                    </Col>
                    <Col span={8}>
                      <p className={styles.contractTitle}>起步价格</p>
                    </Col>
                    <Col span={8}>
                      <p className={styles.contractVal}>
                        {this.state.dataSource.perdistancefee}
                      </p>
                    </Col>
                    <Col span={8}>
                      <p className={styles.contractVal}>{this.state.dataSource.mindistance}</p>
                    </Col>
                    <Col span={8}>
                      <p className={styles.contractVal}>{this.state.dataSource.mindistancefee}</p>
                    </Col>
                  </Row>

                  <Row style={{ marginTop: '10px' }}>
                    <Col span={8}>
                      <p className={styles.contractTitle}>每分钟收费</p>
                    </Col>
                    <Col span={8}>
                      <p className={styles.contractTitle}>年代</p>
                    </Col>
                    <Col span={8}>
                      <p className={styles.contractTitle}>制造商</p>
                    </Col>
                    <Col span={8}>
                      <p className={styles.contractVal}>
                        {this.state.dataSource.perdurationfee}
                      </p>
                    </Col>
                    <Col span={8}>
                      <p className={styles.contractVal}>{this.state.dataSource.yearno }</p>
                    </Col>
                    <Col span={8}>
                      <p className={styles.contractVal}>{this.state.dataSource.factory}</p>
                    </Col>
                  </Row>

                  <Row style={{ marginTop: '10px' }}>
                    <Col span={8}>
                      <p className={styles.contractTitle}>上次年检日期</p>
                    </Col>
                    <Col span={8}>
                      <p className={styles.contractTitle}>下次年检日期</p>
                    </Col>
                    <Col span={8}>
                      <p className={styles.contractTitle}>保险生效日期</p>
                    </Col>
                    <Col span={8}>
                      <p className={styles.contractVal}>{this.state.dataSource.precheckdate}</p>
                    </Col>
                    <Col span={8}>
                      <p className={styles.contractVal}>{this.state.dataSource.nextcheckdate}</p>
                    </Col>
                    <Col span={8}>
                      <p className={styles.contractVal}>{this.state.dataSource.insurancestartdate}</p>
                    </Col>
                  </Row>
                  <Row style={{ marginTop: '10px' }}>
                    <Col span={8}>
                      <p className={styles.contractTitle}>保险到期日期</p>
                    </Col>
                    <Col span={8}>
                      <p className={styles.contractTitle}>出租状态</p>
                    </Col>
                    <Col span={8}>
                      <p className={styles.contractTitle}>维护状态</p>
                    </Col>
                    <Col span={8}>
                      <p className={styles.contractVal}>{this.state.dataSource.insuranceenddate}</p>
                    </Col>
                    <Col span={8}>
                      <p className={styles.contractVal}>{this.state.dataSource.rentflag === '0' ? '上架' :
                        this.state.dataSource.rentflag === '1' ? '下架' : '出租中'}</p>
                    </Col>

                    <Col span={8}>
                      <p className={styles.contractVal}>{this.state.dataSource.maintainflag === '0' ? '正常' :
                        this.state.dataSource.maintainflag === '1' ? '故障' : '充电中'}</p>
                    </Col>
                  </Row>

                  <Row style={{ marginTop: '10px' }}>
                    <Col span={8}>
                      <p className={styles.contractTitle}>车辆类型</p>
                    </Col>
                    <Col span={8}>
                      <p className={styles.contractTitle}>座位数</p>
                    </Col>
                    <Col span={8}>
                      <p className={styles.contractTitle}>续航里程</p>
                    </Col>
                    <Col span={8}>
                      <p className={styles.contractVal}>{this.state.dataSource.fueltype === '0' ? '电车' :
                        this.state.dataSource.fueltype === '1' ? '燃油车' : '其他'}</p>
                    </Col>
                    <Col span={8}>
                      <p className={styles.contractVal}>{this.state.dataSource.seats}</p>
                    </Col>
                    <Col span={8}>
                      <p className={styles.contractVal}>{this.state.dataSource.mileage}</p>
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
