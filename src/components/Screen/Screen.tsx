// 筛选
import React from 'react'
import { Tooltip, Icon } from 'antd'
import moment from 'moment'

class Screen extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      columns: [],
      filters: {},
    }
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      columns: nextProps.columns,
      filters: nextProps.filters,
    })
  }
  TagMap = () => {
    const list = []
    const filters = JSON.parse(JSON.stringify(this.state.filters))
    for (const key in filters) {
      if (filters[key] !== '' && filters[key] !== null && filters[key].length > 0) {
        const tag = {}
        this.state.columns.forEach((json) => {
          let keyIndex = ''
          if (json.dataIndex !== null) {
            keyIndex = json.dataIndex
          } else {
            keyIndex = json.key
          }
          if (keyIndex === key) {
            tag.title = json.title
            tag.index = keyIndex
            let str = ''
            if (json.filters != null) {
              json.filters.forEach((json2) => {
                filters[key].forEach((json3) => {
                  if (json2.value.toString() === json3.toString()) {
                    str += `${json2.text} `
                  }
                })
              })
            } else if (key.indexOf('electricFee') >= 0) {
              str = `${filters[key][0]}~${filters[key][1]}`
            } else if (key.indexOf('Date') >= 0) {
              const arr = []
              filters[key].forEach((dataStr) => {
                arr.push(`${moment(dataStr).format('YYYY-MM-DD')}  `)
              })
              str = arr
            } else {
              tag.title = '搜索'
              tag.index = keyIndex
              str = filters[key]
            }
            tag.str = str
          }
        })
        list.push(tag)
      }
    }
    return list
  }
  close = (index) => {
    const json = JSON.parse(JSON.stringify(this.state.filters))
    for (const key in json) {
      if (key === index) {
        json[index] = null
      }
    }
    this.setState({
      filters: json,
    })
    this.props.callback(json)
  }
  handleReset = () => {
    const json = JSON.parse(JSON.stringify(this.state.filters))
    for (const key in json) {
      if (json[key] !== null) {
        json[key] = null
      }
    }
    this.setState({
      filters: json,
    })
    this.props.callback(json)
  }
  jsonLength = (jsonData) => {
    let jsonLength = 0
    for (const item in jsonData) {
      if (jsonData[item] !== '' && jsonData[item] !== null && jsonData[item].length > 0) {
        jsonLength += 1
      }
    }
    return jsonLength
  }
  render() {
    if (this.jsonLength(this.state.filters) > 0) {
      return (
        <div style={{
          margin: '20px 0',
          fontSize: '14px',
        }}
        >
          <span>筛选项：</span>
          {
            this.TagMap().map((json5) => {
              return (
                <Tooltip key={json5.index} placement="bottom" title={json5.str}>
                  <div style={{ marginLeft: '14px', display: 'inline-block' }}>
                    <span>{json5.title}</span>
                    <Icon
                      type="close-circle-o"
                      style={{ marginLeft: '10px', cursor: 'pointer' }}
                      onClick={() => this.close(json5.index)}
                    />
                  </div>
                </Tooltip>
              )
            })
          }
          <span
            style={{ marginLeft: '20px', cursor: 'pointer', color: '#108EE9' }}
            onClick={this.handleReset}
          >清空筛选项
          </span>
        </div>
      )
    } else {
      return null
    }
  }
}
export default Screen
