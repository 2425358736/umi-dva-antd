// 地图 点击事件
import React from 'react'
import ReactQMap from 'react-qmap'
import { Modal } from 'antd'

class Map extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      latitude: 30.53786,
      longitude: 104.07265,
      bool: false,
    }
  }

  componentDidMount() {
    setTimeout(() => {this.setState({bool: true})}, 500)
  }

  render() {
    const that = this
    return (
      <div>
            {this.state.bool && (
              <ReactQMap
                center={{latitude: 30.53786, longitude: 104.07265}}
                initialOptions={{zoomControl: true, mapTypeControl: true}}
                apiKey="UEXBZ-BOMLW-2XART-OJ322-X52T3-BQBXD"
                style={{height: 550}}
                getMap = {(map, maps) => {
                  // 当前浏览器ip位置
                  new window.qq.maps.CityService({
                    complete : function(result) {
                      map.setCenter(result.detail.latLng)
                    }
                  }).searchLocalCity()

                  // 标记
                  const marker = new maps.Marker({
                    'position':  new maps.LatLng(that.state.latitude, that.state.longitude),
                    map: map
                  })
                  // 地图点击事件
                  maps.event.addListener(map, 'click', function(event) {
                    marker.setPosition(event.latLng)
                  })
                  // 标记点击事件
                  maps.event.addListener(marker, 'click', function() {
                    Modal.info({
                      title: '地图',
                      content: (
                        <div>
                          <p>这是标记点信息</p>
                          <p>这是标记点信息</p>
                        </div>
                      ),
                    })
                  })
                }}
              />
            )}
      </div>
    )
  }
}

export default Map
