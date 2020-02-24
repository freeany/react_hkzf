import React, { Component } from 'react'

import { Carousel, Flex, Modal } from 'antd-mobile'

import NavHeader from '../../components/NavHeader'
import HouseItem from '../../components/HouseItem'
import HousePackage from '../../components/HousePackage'
import { API, isLogin, getToken } from '../../utils/index'

import { REACT_APP_URL as BASE_URL } from '../../utils'

import styles from './index.module.css'

// 猜你喜欢
const recommendHouses = [
  {
    id: 1,
    houseImg: '/img/message/1.png',
    desc: '72.32㎡/南 北/低楼层',
    title: '安贞西里 3室1厅',
    price: 4500,
    tags: ['随时看房']
  },
  {
    id: 2,
    houseImg: '/img/message/2.png',
    desc: '83㎡/南/高楼层',
    title: '天居园 2室1厅',
    price: 7200,
    tags: ['近地铁']
  },
  {
    id: 3,
    houseImg: '/img/message/3.png',
    desc: '52㎡/西南/低楼层',
    title: '角门甲4号院 1室1厅',
    price: 4300,
    tags: ['集中供暖']
  }
]

// 百度地图
const BMap = window.BMap

const labelStyle = {
  position: 'absolute',
  zIndex: -7982820,
  backgroundColor: 'rgb(238, 93, 91)',
  color: 'rgb(255, 255, 255)',
  height: 25,
  padding: '5px 10px',
  lineHeight: '14px',
  borderRadius: 3,
  boxShadow: 'rgb(204, 204, 204) 2px 2px 2px',
  whiteSpace: 'nowrap',
  fontSize: 12,
  userSelect: 'none'
}

export default class HouseDetail extends Component {
  state = {
    isLoaded: true,
    isFavorite: false,

    houseInfo: {
      // 房屋图片
      houseImg: [],
      // 标题
      title: '',
      // 标签
      tags: [],
      // 租金
      price: 0,
      // 房型
      roomType: '两室一厅',
      // 房屋面积
      size: 89,
      // 装修类型
      renovation: '精装',
      // 朝向
      oriented: [],
      // 楼层
      floor: '',
      // 小区名称
      community: '',
      // 地理位置
      coord: {
        latitude: '39.928033',
        longitude: '116.529466'
      },
      // 房屋配套
      supporting: [],
      // 房屋标识
      houseCode: '',
      // 房屋描述
      description: ''
    }
  }

  // ------------------操作数据----------------

  // -------------------钩子函数-----------------------
  render() {
    const { isLoaded } = this.state
    const {
      title,
      community,
      tags,
      price,
      description,
      roomType,
      floor,
      oriented,
      size,
      supporting
    } = this.state.houseInfo
    return (
      <div className={styles.root}>
        {/* 导航栏 */}
        <NavHeader
          className={[styles.navHeader, 'aa'].join(' ')}
          rightContent={[<i key="share" className="iconfont icon-share" />]}
        >
          {community}
        </NavHeader>

        {/* 轮播图 */}
        <div className={styles.slides}>
          {isLoaded ? (
            <Carousel autoplay infinite autoplayInterval={5000}>
              {this.renderSwipers()}
            </Carousel>
          ) : (
            ''
          )}
        </div>

        {/* 房屋基础信息 */}
        <div className={styles.info}>
          <h3 className={styles.infoTitle}>{title}</h3>
          <Flex className={styles.tags}>
            <Flex.Item>
              {tags.map((item, index) => {
                let tagClass = ''
                index < 2 ? (tagClass = `tag${index + 1}`) : (tagClass = `tag3`)
                return (
                  <span
                    key={item}
                    className={[styles.tag, styles[tagClass]].join(' ')}
                  >
                    {item}
                  </span>
                )
              })}
            </Flex.Item>
          </Flex>

          <Flex className={styles.infoPrice}>
            <Flex.Item className={styles.infoPriceItem}>
              <div>
                {price}
                <span className={styles.month}>/月</span>
              </div>
              <div>租金</div>
            </Flex.Item>
            <Flex.Item className={styles.infoPriceItem}>
              <div>{roomType}</div>
              <div>房型</div>
            </Flex.Item>
            <Flex.Item className={styles.infoPriceItem}>
              <div>{size}平米</div>
              <div>面积</div>
            </Flex.Item>
          </Flex>

          <Flex className={styles.infoBasic} align="start">
            <Flex.Item>
              <div>
                <span className={styles.title}>装修：</span>
                精装
              </div>
              <div>
                <span className={styles.title}>楼层：</span>
                {floor}
              </div>
            </Flex.Item>
            <Flex.Item>
              <div>
                <span className={styles.title}>朝向：</span>
                {oriented[0]}
              </div>
              <div>
                <span className={styles.title}>类型：</span>
                普通住宅
              </div>
            </Flex.Item>
          </Flex>
        </div>

        {/* 地图位置 */}
        <div className={styles.map}>
          <div className={styles.mapTitle}>
            小区：
            <span>{community}</span>
          </div>
          <div className={styles.mapContainer} id="map">
            地图
          </div>
        </div>

        {/* 房屋配套 */}
        <div className={styles.about}>
          <div className={styles.houseTitle}>房屋配套</div>
          {supporting.length > 0 ? (
            <HousePackage list={supporting} />
          ) : (
            <div className="title-empty">暂无数据</div>
          )}
          {/* <div className="title-empty">暂无数据</div> */}
        </div>

        {/* 房屋概况 */}
        <div className={styles.set}>
          <div className={styles.houseTitle}>房源概况</div>
          <div>
            <div className={styles.contact}>
              <div className={styles.user}>
                <img src={BASE_URL + '/img/avatar.png'} alt="头像" />
                <div className={styles.useInfo}>
                  <div>王女士</div>
                  <div className={styles.userAuth}>
                    <i className="iconfont icon-auth" />
                    已认证房主
                  </div>
                </div>
              </div>
              <span className={styles.userMsg}>发消息</span>
            </div>

            <div className={styles.descText}>
              {description || '暂无房屋描述'}
              {/* 1.周边配套齐全，地铁四号线陶然亭站，交通便利，公交云集，距离北京南站、西站都很近距离。
              2.小区规模大，配套全年，幼儿园，体育场，游泳馆，养老院，小学。
              3.人车分流，环境优美。
              4.精装两居室，居家生活方便，还有一个小书房，看房随时联系。 */}
            </div>
          </div>
        </div>

        {/* 推荐 */}
        <div className={styles.recommend}>
          <div className={styles.houseTitle}>猜你喜欢</div>
          <div className={styles.items}>
            {recommendHouses.map(item => (
              <HouseItem {...item} key={item.id} />
            ))}
          </div>
        </div>

        {/* 底部收藏按钮 */}
        <Flex className={styles.fixedBottom}>
          <Flex.Item onClick={this.handleFavorite}>
            <img
              src={
                BASE_URL +
                (this.state.isFavorite ? '/img/star.png' : '/img/unstar.png')
              }
              className={styles.favoriteImg}
              alt="收藏"
            />
            <span className={styles.favorite}>
              {this.state.isFavorite ? '已收藏' : '收藏'}
            </span>
          </Flex.Item>
          <Flex.Item>在线咨询</Flex.Item>
          <Flex.Item>
            <a href="tel:400-618-4000" className={styles.telephone}>
              电话预约
            </a>
          </Flex.Item>
        </Flex>
      </div>
    )
  }
  componentDidMount() {
    // 请求该 房源的数据
    this.getDetailHouse()

    // 获取当前房源是否被  当前登录用户收藏
    this.houseIsFavvorite()
  }

  // 获取当前房源是否被收藏, 用来做收藏的状态显示
  houseIsFavvorite = async () => {
    // 该 接口添加用户tonken。
    if (!isLogin()) {
      return
    }
    const { id } = this.props.match.params
    const res = await API.get(`/user/favorites/${id}`)
    console.log(res, 'res....')
    this.setState({
      isFavorite: res.data.body.isFavorite
    })
  }

  // 点击收藏 // 进行收藏  /  取消收藏
  handleFavorite = async () => {
    const { id } = this.props.match.params

    if (!isLogin()) {
      Modal.alert('温馨提示', '登录后才可以收藏', [
        { text: '取消' },
        {
          text: '确定',
          onPress: () => {
            this.props.history.push('/login')
          }
        }
      ])
    } else {
      // 已经收藏, 需要调用删除接口
      if (this.state.isFavorite) {
        Modal.alert('温馨提示', '确定要取消收藏吗', [
          { text: '取消' },
          {
            text: '确定',
            onPress: async () => {
              let res2 = await API.delete(`/user/favorites/${id}`)

              if (res2.data.status === 200) {
                this.setState({
                  isFavorite: false
                })
              }
            }
          }
        ])
      } else {
        // 未被收藏
        // 未收藏
        let res1 = await await API.post(`/user/favorites/${id}`, null, {
          headers: {
            authorization: getToken()
          }
        })

        if (res1.data.status === 200) {
          this.setState({
            isFavorite: true
          })
        }
      }
    }
  }

  // 请求数据
  async getDetailHouse() {
    // 获取id
    const { id } = this.props.match.params

    // 请求
    let res = await API.get(`/houses/${id}`)
    const {
      houseImg,
      title,
      tags,
      price,
      houseCode,
      description,
      roomType,
      oriented,
      floor,
      community,
      coord,
      supporting,
      size
    } = res.data.body

    this.renderMap(community, coord)

    this.setState({
      houseInfo: {
        ...this.state.houseInfo,
        // 房屋图片
        houseImg,
        // 标题
        title,
        // 标签
        tags,
        // 租金
        price,
        // 房型
        roomType,
        // 房屋面积
        size,
        // 装修类型
        renovation: '精装',
        // 朝向
        oriented,
        // 楼层
        floor,
        // 小区名称
        community,
        // 地理位置
        coord: {
          ...this.state.houseInfo.coord,
          latitude: coord.latitude,
          longitude: coord.longitude
        },
        // 房屋配套
        supporting,
        // 房屋标识
        houseCode,
        // 房屋描述
        description
      }
    })
  }

  // ----------------------渲染元素----------------------
  // 渲染轮播图结构
  renderSwipers() {
    const {
      houseInfo: { houseImg }
    } = this.state

    return houseImg.map(item => (
      <a
        key={item}
        href="http://itcast.cn"
        style={{
          display: 'inline-block',
          width: '100%',
          height: 250
        }}
      >
        <img
          src={BASE_URL + item}
          alt=""
          style={{
            width: '100%',
            height: 250,
            verticalAlign: 'top'
          }}
        />
      </a>
    ))
  }

  // 渲染地图
  renderMap(community, coord) {
    const { latitude, longitude } = coord

    const map = new BMap.Map('map')
    const point = new BMap.Point(longitude, latitude)
    map.centerAndZoom(point, 17)

    const label = new BMap.Label('', {
      position: point,
      offset: new BMap.Size(0, -36)
    })

    label.setStyle(labelStyle)
    label.setContent(`
      <span>${community}</span>
      <div class="${styles.mapArrow}"></div>
    `)
    map.addOverlay(label)
  }
}
