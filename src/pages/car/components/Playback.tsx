// 详情
import React from 'react'
import ReactQMap from 'react-qmap'
import { Button, DatePicker, message } from 'antd'
import { getRequest } from 'utils/api'

let mapTx
class Playback extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      dataSource: {},
      bool: false,
      center: {latitude: 39.91063, longitude: 116.40308},
      startDate: '',
      endDate: ''
    }
  }

  componentDidMount = async () => {
    this.setState({
      dataSource: this.props.record
    })
    setTimeout(() => {
      this.setState({bool: true})
    },         500)
  }
  search = async () => {
    if (this.state.startDate.length > 0 && this.state.endDate.length > 0 ) {
      const data = await getRequest('/api-biz/vehicle/trackme?vehicleid='
        + this.props.record.id + '&starttime=' + this.state.startDate + '&endtime=' + this.state.endDate)
      const path = []
      if (data.data && data.data.length > 0) {
        data.data.forEach((json) => {
          path.push(new window.qq.maps.LatLng(parseFloat(json.latitude ? json.latitude : 0),
                                              parseFloat(json.longtitude ? json.longtitude : 0)))
        })
        await this.setState({
          path: path,
          center: {
            latitude: parseFloat(data.data[0].latitude ? data.data[0].latitude : 0),
            longitude: parseFloat(data.data[0].longtitude ? data.data[0].longtitude : 0)
          }
        })
      }
      const pol = new window.qq.maps.Polyline({
        path: path,
        strokeColor: '#000000',
        strokeWeight: 5,
        editable: false,
        strokeDashStyle: 'dash',
        strokeWeight: 2,
        map: mapTx
      })
    } else {
      message.success('请选择日期')
    }
  }

  onChangeStart = (value, dateString) => {
    this.setState({
      startDate: dateString
    })
  }
  onChangeEnd = (value, dateString) => {
    this.setState({
      endDate: dateString
    })
  }
  render() {
    return (
      <div>
        {this.state.bool && (
        <ReactQMap
          center={this.state.center}
          initialOptions={{zoomControl: true, mapTypeControl: true, zoom: 16}}
          apiKey="UEXBZ-BOMLW-2XART-OJ322-X52T3-BQBXD"
          style={{height: 500}}
          getMap ={(map, maps) => {
            mapTx = map
          }
          }
        />
        )}
        开始时间：
        <DatePicker
          showTime={true}
          format="YYYY-MM-DD HH:mm:ss"
          placeholder="Select Time"
          onChange={this.onChangeStart}
        />
        结束时间：
        <DatePicker
          showTime={true}
          format="YYYY-MM-DD HH:mm:ss"
          placeholder="Select Time"
          onChange={this.onChangeEnd}
        />
        <Button onClick={this.search}>搜索</Button>
      </div>
    )
  }
}

export default Playback
