import React, { Component } from 'react'
import { Alert, Tooltip, Icon, message } from 'antd'
import { Login } from 'ant-design-pro'
const styles = require('./Login.less')
import { postFormDateRequest } from '../../utils/api'

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
      values.grant_type = 'password'
      values.client_id = 'webApp'
      values.client_secret = 'webApp'

      const data = await postFormDateRequest(
        '/api-auth/oauth/token',
        values
      )
      const Authorization = data.access_token
      localStorage.setItem('Authorization', Authorization)

      window.location.href = '/'
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
              name="username"
              placeholder="请输入用户名"
            />
            <Password
              prefix={<Icon type="lock"
                            style={{ color: 'rgba(0, 0, 0, .25)', fontSize: '20px' }} />}
              className={styles.inputDom}
              name="password"
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
