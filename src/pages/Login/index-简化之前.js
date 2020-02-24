import React, { Component } from 'react'
import { Flex, Toast, WingBlank, WhiteSpace } from 'antd-mobile'
import { API, setToken } from '../../utils'

import { Link } from 'react-router-dom'
import { withFormik } from 'formik'
import * as Yup from 'yup'

import NavHeader from '../../components/NavHeader'

import styles from './index.module.css'

// 验证规则：
const REG_UNAME = /^[a-zA-Z_\d]{3,5}$/
const REG_PWD = /^[a-zA-Z_\d]{5,12}$/

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
      handleSubmit,
      errors,
      handleBlur,
      touched
    } = this.props
    console.log(errors, 'errors......')
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
                onBlur={handleBlur}
                placeholder="请输入账号"
              />
            </div>
            {/* 长度为5到8位，只能出现数字、字母、下划线 */}
            {errors.username && touched.username && (
              <div className={styles.error}>{errors.username}</div>
            )}
            <div className={styles.formItem}>
              <input
                className={styles.input}
                name="password"
                type="password"
                value={password}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="请输入密码"
              />
            </div>
            {/* 长度为5到12位，只能出现数字、字母、下划线 */}
            {errors.password && touched.password && (
              <div className={styles.error}>{errors.password}</div>
            )}
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

  // 无需安装任何依赖装 validate校验规则
  // validate: values => {
  //   const errors = {}

  //   if (!values.username) {
  //     errors.username = '用户名为必填项'
  //   } else if (!REG_UNAME.test(values.username)) {
  //     errors.username = '用户名格式不正确'
  //   }
  //   if (!values.password) {
  //     errors.password = '密码为必填项'
  //   } else if (!REG_PWD.test(values.password)) {
  //     errors.password = '密码格式不正确'
  //   }
  //   return errors
  // },
  // 安装yup的校验方式
  validationSchema: Yup.object().shape({
    username: Yup.string()
      .required('账户 为必填项')
      .matches(REG_UNAME, '用户名格式应该在3-5之间'),
    password: Yup.string()
      .required('密码 为必填项')
      .matches(REG_PWD, '密码应该在5-12之间')
  }),
  // 当点击登录的时候才会触发   Login组件的 render函数
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
