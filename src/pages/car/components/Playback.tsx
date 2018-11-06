// 详情
import React from 'react'
import ReactQMap from 'react-qmap'
import { Button, DatePicker } from 'antd'
import { postRequest } from 'utils/api'

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
    const json = {}
    json.id = this.props.record.id
    json.startDate = this.state.startDate
    json.endDate = this.state.endDate
    console.log(json)
    const path = [
      new window.qq.maps.LatLng(39.90799, 116.39939),
      new window.qq.maps.LatLng(39.90794, 116.39756),
      new window.qq.maps.LatLng(39.90862, 116.39752)
    ]
    await this.setState({
      path: path,
      center: {latitude: 39.90799, longitude: 116.39939}
    })
    const pol = new window.qq.maps.Polyline({
      path: path,
      strokeColor: '#000000',
      strokeWeight: 5,
      editable: false,
      strokeDashStyle: 'dash',
      strokeWeight: 2,
      map: mapTx
    })
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
