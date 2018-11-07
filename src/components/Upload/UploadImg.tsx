import { Upload, Icon, Modal, message } from 'antd'
import React from 'react'
import { http, putRequest } from '../../utils/api'

class UploadImg extends React.Component {
  constructor(props) {
    super(props)
    const fileList = []
    if (props.fileList !== null && typeof props.fileList !== 'undefined' && props.fileList !== '') {
      if (props.fileList.length > 0) {
        const imgArr = props.fileList.split('#')
        imgArr.forEach((img, i) => {
          if (img !== '') {
            const json = {
              uid: i,
              status: 'done',
              name: img,
              url: `${http}/api-biz/file/download/${img}?access_token=${localStorage.getItem('Authorization')}`,
            }
            fileList.push(json)
          }
        })
      }
    }
    this.state = {
      previewVisible: false,
      previewImage: '',
      fileList,
    }
  }

  handleCancel = () => {
    this.setState({ previewVisible: false })
  }

  handlePreview = file => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    })
  }

  handleChange = ({ fileList }) => {
    let imgUrl = ''
    fileList.forEach(file => {
      if (typeof file.response !== 'undefined') {
        imgUrl = `${imgUrl + file.response.data}#`
      } else {
        imgUrl = `${imgUrl + file.name}#`
      }
    })
    this.props.callback(imgUrl)
    this.setState({ fileList })
  }

  render() {
    const { previewVisible, previewImage, fileList } = this.state
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">Upload</div>
      </div>
    )
    return (
      <div className="clearfix">
        <Upload
          action={http + '/api-biz/file/upload1'}
          listType="picture-card"
          fileList={fileList}
          onPreview={this.handlePreview}
          onChange={this.handleChange}
          headers = {
            {Authorization: 'Bearer ' + localStorage.getItem('Authorization')}
          }
        >
          {fileList.length >= 1 ? null : uploadButton}
        </Upload>
        <Modal
          maskClosable={false}
          visible={previewVisible}
          footer={null}
          onCancel={this.handleCancel}
        >
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
    )
  }
}

export default UploadImg
