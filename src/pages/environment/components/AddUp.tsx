// 添加和修改组件
import React from 'react'
import { Button, Input, Form, message } from 'antd'
import ReactQMap from 'react-qmap'
import { postRequest } from '../../../utils/api'

const styles = require('../index.less')

const FormItem = Form.Item

class AddUp extends React.Component {
  constructor(props) {
    super(props)
    /**
     *
     * @type
     * {
     *  {
     *    buttonLoading: boolean 按钮加载中 防止重复提交
     *   }
     * }
     */
    this.state = {
      buttonLoading: false,
      latitude: 30.53786,
      longitude: 104.07265,
      bool: false,
    }
  }

  componentDidMount() {
      this.initialization()
      setTimeout(() => {this.setState({bool: true})}, 500)
  }
  /**
   * 初始化方法
   * @returns {Promise<void>}
   */
  initialization = async () => {
    this.props.form.resetFields()
    if (this.props.record.id > 0) {
      this.setState({
        latitude: this.props.record.latitude,
        longitude: this.props.record.longtitude,
      })
      this.props.form.setFieldsValue({
        name: this.props.record.name,
        address: this.props.record.address,
        parkno: this.props.record.parkno,
        carno: this.props.record.carno,
        imgurl: this.props.record.imgurl,
      })
    }
  }

  /**
   * 表单提交方法
   * @returns {Promise<void>}
   */
  handleSubmit = async () => {
      let adopt = false
      this.props.form.validateFields(
        (err) => {
          if (err) {
            adopt = false
          } else {
            adopt = true
          }
        },
      )
      if (adopt) {
        this.setState({
          buttonLoading: true,
        })
        const json = this.props.form.getFieldsValue()
        json.longtitude = this.state.longitude.toFixed(5)
        json.latitude = this.state.latitude.toFixed(5)
        let data
        if (this.props.record.id > 0) {
          json.id = this.props.record.id
          data = await postRequest(
            '/api-biz/station/update',
            json
          )
        } else {
          data = await postRequest(
            '/api-biz/station/save',
            json
          )
        }
        if (data.resp_code === 0) {
          this.props.callback({ type: 'submit' })
        }
        message.success(`${data.resp_msg}`)
        this.setState({
          buttonLoading: false,
        })
      }
    }

  /**
   * 取消方法
   */
  handleCancel = () => {
    this.props.callback({ type: 'cancel' })
  }

  render() {
      const { getFieldDecorator } = this.props.form
      const that = this
      return (
        <div style={{ marginLeft: '10%', overflow: 'hidden' }} >
          <Form layout="horizontal">
            <FormItem
              label="名称"
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 15 }}
            >
              {getFieldDecorator('name', {
                  rules: [{
                    required: true,
                    message: '请输入名称',
                  }],
                })(

                  <Input placeholder="请输入名称" />
                )}
            </FormItem>
            <FormItem
              label="地址"
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 15 }}
            >
              {getFieldDecorator('address', {
                  rules: [{
                    required: true,
                    message: '请输入地址',
                  }],
                })(

                  <Input placeholder="请输入地址" />
                )}
            </FormItem>

            <FormItem
              label="车位数"
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 15 }}
            >
              {getFieldDecorator('parkno', {
                rules: [{
                  required: true,
                  message: '请输入车位数',
                }],
              })(

                <Input placeholder="请输入车位数" />
              )}
            </FormItem>

            <FormItem
              label="车辆"
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 15 }}
            >
              {getFieldDecorator('carno', {
                rules: [{
                  required: true,
                  message: '请输入车辆',
                }],
              })(

                <Input placeholder="请输入车辆" />
              )}
            </FormItem>
            <FormItem
              label="图标"
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 15 }}
            >
              {getFieldDecorator('imgurl', {
                rules: [{
                  required: true,
                  message: '请输入图标',
                }],
              })(

                <Input placeholder="请输入图标" />
              )}
            </FormItem>

            <FormItem
              label="地图"
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 15 }}
            >
              {this.state.bool && (
              <ReactQMap
                center={{latitude: this.state.latitude, longitude: this.state.longitude}}
                mySpot={{latitude: this.state.latitude, longitude: this.state.longitude}}
                initialOptions={{zoomControl: true, mapTypeControl: true}}
                apiKey="UEXBZ-BOMLW-2XART-OJ322-X52T3-BQBXD"
                style={{height: 300}}
                getMap = {(map, maps) => {
                  maps.event.addListener(map, 'click', function(event) {
                    that.setState({
                      latitude: event.latLng.getLat(),
                      longitude: event.latLng.getLng()
                    })
                  })
                }}
              />
              )}
            </FormItem>
          </Form>
          <div style={{ float: 'right', marginRight: '8%', marginTop: 20 }}>
            <Button
              onClick={this.handleCancel}
              style={{ backgroundColor: 'rgba(243, 243, 243, 1)', color: '#666666', marginRight: 20 }}
            >取消
            </Button>
            <Button
              loading={this.state.buttonLoading}
              onClick={this.handleSubmit}
              type="primary"
              style={{ }}
            >提交
            </Button>
          </div>
        </div>
      )
  }
}

const AddUpComponent = Form.create()(AddUp)

export default AddUpComponent
