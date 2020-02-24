import React, { Component } from 'react'
import { Flex, Toast, WingBlank, WhiteSpace } from 'antd-mobile'
import { API, setToken } from '../../utils'

import { Link } from 'react-router-dom'
import { withFormik } from 'formik'

import NavHeader from '../../components/NavHeader'

import styles from './index.module.css'

// 验证规则：
// const REG_UNAME = /^[a-zA-Z_\d]{3,5}$/
// const REG_PWD = /^[a-zA-Z_\d]{5,12}$/

class Login extends Component {
  // state = {
  //   username: '',
  //   password: ''
  // }
  // handleChange = e => {
  //   this.setState({
  //     [e.target.name]: e.target.value
  //   })
  // }
  // submitLogin = async e => {
  //   e.preventDefault()
  // }
  render() {
    const {
      values: { username, password },
      handleChange,
      handleSubmit
    } = this.props
    return (
      <div className={styles.root}>
        {/* 顶部导航 */}
        <NavHeader className={styles.navHeader}>账号登录</NavHeader>
        <WhiteSpace size="xl" />

        {/* 登录表单 */}
        <WingBlank>
          <form onSubmit={handleSubmit}>
            <div className={styles.formItem}>
              <input
                className={styles.input}
                name="username"
                value={username}
                onChange={handleChange}
                placeholder="请输入账号"
              />
            </div>
            {/* 长度为5到8位，只能出现数字、字母、下划线 */}
            {/* <div className={styles.error}>账号为必填项</div> */}
            <div className={styles.formItem}>
              <input
                className={styles.input}
                name="password"
                type="password"
                value={password}
                onChange={handleChange}
                placeholder="请输入密码"
              />
            </div>
            {/* 长度为5到12位，只能出现数字、字母、下划线 */}
            {/* <div className={styles.error}>账号为必填项</div> */}
            <div className={styles.formSubmit}>
              <button className={styles.submit} type="submit">
                登 录
              </button>
            </div>
          </form>
          <Flex className={styles.backHome}>
            <Flex.Item>
              <Link to="/registe">还没有账号，去注册~</Link>
            </Flex.Item>
          </Flex>
        </WingBlank>
      </div>
    )
  }
}

Login = withFormik({
  // mapPropsToValues 提供表单元素的状态值， 相当于在state里面添加属性
  mapPropsToValues: () => ({ username: '', password: '' }),

  handleSubmit: async (values, { props }) => {
    const { username, password } = values
    let res = await API.post('/user/login', {
      username,
      password
    })

    // console.log(res, ' res.....')

    if (res.data.status === 200) {
      //1. 提示
      Toast.success('登录成功', 2, () => {
        //3. 返回
        props.history.goBack()
      })
      //2. 把 token 保存起来
      setToken(res.data.body.token)
    } else {
      Toast.fail('账户或密码错误', 2)
    }
  }
})(Login)

export default Login
