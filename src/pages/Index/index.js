import React, { Component } from 'react'
import { Carousel, Flex, Grid, WingBlank } from 'antd-mobile'
import axios from 'axios'
import { getCurrentCity } from '../../utils'
import './index.scss'

// 引入图片
import nav1 from '../../asstes/images/nav-1.png'
import nav2 from '../../asstes/images/nav-2.png'
import nav3 from '../../asstes/images/nav-3.png'
import nav4 from '../../asstes/images/nav-4.png'
// 调整样式
// 没有接口， 封装可维护性数据
const menus = [
  {
    id: 1,
    imgSrc: nav1,
    text: '整租'
  },
  {
    id: 2,
    imgSrc: nav2,
    text: '合租'
  },
  {
    id: 3,
    imgSrc: nav3,
    text: '地图找房'
  },
  {
    id: 4,
    imgSrc: nav4,
    text: '去出租'
  }
]

class Index extends Component {
  state = {
    // 轮播图
    data: [],
    imgHeight: 212,
    isGetSwiperImgsData: false,
    // 租房小组
    groups: [],
    // 最新资讯
    news: [],
    // 当前城市
    currentCity: '北京'
  }
  // 请求banner数据    ---
  async fy_getSwiperImgsData() {
    let result = await axios.get('http://localhost:8080/home/swiper')
    const { status, body } = result.data
    if (status === 200) {
      this.setState(
        {
          data: body,
          isGetSwiperImgsData: true
        },
        () => {
          // console.log(this.state.data)
        }
      )
    }
  }
  // 请求租房小组数据
  async fy_getGroups() {
    let res = await axios.get(
      'http://localhost:8080/home/groups?area=AREA%7C88cff55c-aaa4-e2e0'
    )

    this.setState(
      {
        groups: res.data.body
      },
      () => {
        // console.log(this.state.groups)
      }
    )
  }
  // 请求新闻news数据
  async fy_getNews() {
    let res = await axios.get(
      'http://localhost:8080/home/news?area=AREA%7C88cff55c-aaa4-e2e0'
    )
    this.setState(
      {
        news: res.data.body
      },
      () => {
        // console.log(this.state.news)
      }
    )
  }
  // 请求 根据百度地图api 获取当前城市数据（然后根据接口获取当前城市是否有房源，没有则后台返回上海）
  async getCurrentCityName() {
    const city = await getCurrentCity()
    this.setState({
      currentCity: city.label
    })
  }
  // 钩子函数
  componentDidMount() {
    this.fy_getSwiperImgsData()
    this.fy_getGroups()
    this.fy_getNews()
    // 获取当前城市
    this.getCurrentCityName()
  }
  // 渲染最新资讯
  renderNews() {
    return this.state.news.map(item => (
      <div className="news-item" key={item.id}>
        <div className="imgwrap">
          <img
            className="img"
            src={`http://localhost:8080${item.imgSrc}`}
            alt=""
          />
        </div>
        <Flex className="content" direction="column" justify="between">
          <h3 className="title">{item.title}</h3>
          <Flex className="info" justify="between">
            <span>{item.from}</span>
            <span>{item.date}</span>
          </Flex>
        </Flex>
      </div>
    ))
  }
  render() {
    const { history } = this.props
    return (
      <div className="home-index">
        {/* 顶部导航搜索 */}
        <div className="index-search">
          <Flex>
            <Flex className="search-left">
              <div
                className="location"
                onClick={() => history.push('/citylist')}
              >
                <span>{this.state.currentCity}</span>
                <i className="iconfont icon-arrow" />
              </div>
              <div
                className="search-form"
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
        {/* 轮播图 */}
        <div className="index-swipper">
          {this.state.isGetSwiperImgsData && (
            <Carousel autoplay={true} infinite>
              {this.state.data.map(val => (
                <a
                  key={val.id || val}
                  href="###"
                  style={{
                    display: 'inline-block',
                    width: '100%',
                    height: this.state.imgHeight
                  }}
                >
                  <img
                    src={'http://localhost:8080' + val.imgSrc}
                    alt=""
                    style={{ width: '100%', verticalAlign: 'top' }}
                    onLoad={() => {
                      this.setState({ imgHeight: 'auto' })
                    }}
                  />
                </a>
              ))}
            </Carousel>
          )}
        </div>
        {/* 菜单导航 */}
        <div className="index-menus">
          <Flex>
            {menus.map(item => {
              return (
                <Flex.Item key={item.id}>
                  <img src={item.imgSrc} alt="" />
                  <p>{item.text}</p>
                </Flex.Item>
              )
            })}
          </Flex>
        </div>
        {/*  租房小组 */}
        <div className="index-groups">
          <Flex className="groups-title" justify="between">
            <h3>租房小组</h3>
            <span>更多</span>
          </Flex>
          {/* 宫格组件 */}
          <Grid
            data={this.state.groups}
            columnNum={2}
            square={false}
            hasLine={false}
            renderItem={item => (
              <Flex className="group-item" justify="around" key={item.id}>
                <div className="desc">
                  <p className="title">{item.title}</p>
                  <span className="info">{item.desc}</span>
                </div>
                <img src={`http://localhost:8080${item.imgSrc}`} alt="" />
              </Flex>
            )}
          />
        </div>
        {/* 最新资讯 */}
        <div className="index-news">
          <h3 className="group-title">最新资讯</h3>
          <WingBlank size="md">{this.renderNews()}</WingBlank>
        </div>
      </div>
    )
  }
}

export default Index
