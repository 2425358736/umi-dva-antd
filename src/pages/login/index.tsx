import React, { Component } from 'react'
import { Alert, Tooltip, Icon, message } from 'antd'
import { Login } from 'ant-design-pro'
const styles = require('./Login.less')
import { postRequest } from '../../utils/api'
import router from 'umi/router'

const { UserName, Password, Submit } = Login

class LoginPage extends Component {
  state = {
    type: 'account'
  }

  onTabChange = (type) => {
    this.setState({ type })
  }

  handleSubmit = async (err, values) => {
    if (!err) {
      const data = await postRequest(
        '/system/verificationUser',
        values
      )
      if (data.code === 0) {
        router.push('/')
      } else {
        message.error(data.message)
      }
    }
  }
  render() {
    const { type } = this.state
    return (
      <div className={styles.main}>
        <Login
          defaultActiveKey={type}
          onTabChange={this.onTabChange}
          onSubmit={this.handleSubmit}
          className={styles.loginRight}
        >
          <div>
            <h3>登陆</h3>
            <UserName
              prefix={<Icon type="user" style={{ color: 'rgba(0, 0, 0, .25)', fontSize: '20px' }} />}
              className={styles.inputDom}
              name="loginName"
              placeholder="请输入用户名"
            />
            <Password
              prefix={<Icon type="lock"
                            style={{ color: 'rgba(0, 0, 0, .25)', fontSize: '20px' }} />}
              className={styles.inputDom}
              name="passWord"
              placeholder="请输入密码"
            />
          </div>
          <div style={{ textAlign: 'right', cursor: 'pointer', marginBottom: '24px' }}>
            <Tooltip title="忘记密码请联系贵公司管理员修改密码">
              <span style={{ color: '#666', fontSize: '14px' }}>忘记密码</span>
            </Tooltip>
          </div>
          <Submit className={styles.btnDom}>登陆</Submit>
        </Login>
      </div>
    )
  }
}
export default LoginPage
