import React, { Component } from 'react'
import { Flex } from 'antd-mobile'
import { withRouter } from 'react-router-dom'
import { getCurrentCity } from '../../utils'
import styles from './index.module.scss'

class SearchHeader extends Component {
  state = {
    currentCity: ''
  }
  componentDidMount() {
    this.getCurrentCityName()
  }
  // 请求 根据百度地图api 获取当前城市数据（然后根据接口获取当前城市是否有房源，没有则后台返回上海）
  async getCurrentCityName() {
    const city = await getCurrentCity()
    this.setState({
      currentCity: city.label
    })
  }
  render() {
    const { history, className } = this.props
    return (
      <div className={className || ''}>
        <Flex>
          <Flex className={styles['search-left']}>
            <div
              className={styles.location}
              onClick={() => history.push('/citylist')}
            >
              <span>{this.state.currentCity}</span>
              <i className="iconfont icon-arrow" />
            </div>
            <div
              className={styles['search-form']}
              onClick={() => history.push('/search')}
            >
              <i className="iconfont icon-seach" />
              <span>请输入小区或地址</span>
            </div>
          </Flex>
          <i
            className="iconfont icon-map"
            onClick={() => history.push('/map')}
          />
        </Flex>
      </div>
    )
  }
}

export default withRouter(SearchHeader)
