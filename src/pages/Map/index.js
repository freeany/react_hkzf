import React, { Component } from 'react'
import NavHeader from '../../components/NavHeader'
import { getCurrentCity } from '../../utils'
import axios from 'axios'
import { Toast } from 'antd-mobile'
import HouseItem from '../../components/HouseItem'

import styles from './index.module.scss'

class Map extends Component {
  state = {
    isShowList: false,
    houseList: []
  }
  componentDidMount() {
    this.fy_resolveAddress()
  }
  // 解析地址， 渲染地图到页面上
  async fy_resolveAddress() {
    const BMap = window.BMap
    const address = await getCurrentCity()
    // 百度地图API功能
    var map = new BMap.Map('container')
    this.map = map
    // 创建地址解析器实例
    var myGeo = new BMap.Geocoder()
    // 将地址解析结果显示在地图上,并调整地图视野
    myGeo.getPoint(
      address.label,
      point => {
        if (point) {
          map.centerAndZoom(point, 11) // 将指定的坐标解析后放到地图中心
          const marker = new BMap.Marker(point) // 创建标注
          map.addOverlay(marker) // 将标注添加到地图中
          map.addControl(new BMap.NavigationControl()) // 添加控件
          map.addControl(new BMap.ScaleControl()) // 添加控件

          // 添加区的覆盖物
          this.renderOverlays(address.value)
        } else {
          alert('您选择地址没有解析到结果!')
        }
      },
      address.label
    )
  }

  // 1. 渲染覆盖物
  renderOverlays = async id => {
    Toast.loading('正在加载中..', 0)

    //1.根据id , 发送请求, 查看房源信息
    let res = await axios.get('http://localhost:8080/area/map', {
      params: { id }
    })
    Toast.hide()
    //2. 通过 getTypeAndZoom  获取 类型(圆 or 方) + 下一次的缩放级别
    const { type, nextZoom } = this.getTypeAndZoom()
    //3. 遍历 创建 渲染物
    res.data.body.forEach(item => {
      // 创建每一个覆盖物
      this.createOverlays(type, nextZoom, item)
    })
  }
  // 2. 获取 类型 和 下一次缩放级别 -- 封装
  getTypeAndZoom() {
    let type
    let curZoom = this.map.getZoom()
    let nextZoom

    if (curZoom === 11) {
      nextZoom = 13
      type = 'circle'
    } else if (curZoom === 13) {
      nextZoom = 15
      type = 'circle'
    } else {
      type = 'react'
    }
    return {
      type,
      nextZoom
    }
  }

  // 3. 创建覆盖物 -- 封装
  createOverlays(type, nextZoom, item) {
    const {
      coord: { longitude, latitude },
      label: areaName,
      value,
      count
    } = item

    // 创建好坐标
    const point = new window.BMap.Point(longitude, latitude)

    // 分创建方 还是圆的
    if (type === 'circle') {
      this.createCircle(point, areaName, value, count, nextZoom)
    } else {
      this.createReact(point, areaName, value, count)
    }
  }

  // 4. 创建 圆 覆盖物 -- 封装
  createCircle(point, areaName, value, count, nextZoom) {
    const BMap = window.BMap
    // 添加覆盖物
    var opts = {
      position: point, // 指定文本标注所在的地理位置
      offset: new BMap.Size(-35, -35) //设置文本偏移量
    }
    var label = new BMap.Label(
      '欢迎使用百度地图，这是一个简单的文本标注哦~',
      opts
    ) // 创建文本标注对象
    label.setStyle({
      height: '0',
      border: '0px solid rgb(255, 0, 0)'
    })
    label.setContent(`<div class="${styles.bubble}">
              <p class="${styles.name}">${areaName}</p>
              <p> ${count}套</p>
          </div>`)
    // 注册点击事件
    label.addEventListener('click', e => {
      //1. 放大
      this.map.centerAndZoom(point, nextZoom)
      //2. 清除覆盖物
      setTimeout(() => {
        this.map.clearOverlays()
      }, 0)
      //3. 添加镇覆盖物
      this.renderOverlays(value)
    })
    this.map.addOverlay(label)
  }

  // 5. 创建 方  覆盖物 -- 封装
  createReact(point, areaName, value, count) {
    const BMap = window.BMap
    // 添加覆盖物
    var opts = {
      position: point, // 指定文本标注所在的地理位置
      offset: new BMap.Size(-50, -10) //设置文本偏移量
    }
    var label = new BMap.Label(
      '欢迎使用百度地图，这是一个简单的文本标注哦~',
      opts
    ) // 创建文本标注对象
    label.setStyle({
      height: '0',
      border: '0px solid rgb(255, 0, 0)'
    })
    label.setContent(`
              <div class="${styles.rect}">
                <span class="${styles.housename}">${areaName}</span>
                <span class="${styles.housenum}">${count}套</span>
                <i class="${styles.arrow}"></i>
              </div>
          `)
    // 注册点击事件
    label.addEventListener('click', e => {
      this.getHouseList(value)
      // 移动
      let x = e.changedTouches[0].clientX - window.innerWidth / 2
      let y = e.changedTouches[0].clientY - (window.innerHeight - 330) / 2

      this.map.panBy(-x, -y)
    })
    this.map.addOverlay(label)
  }

  // 创建房屋列表结构
  renderHouseList = () => {
    return this.state.houseList.map(item => (
      <HouseItem key={item.houseCode} {...item}></HouseItem>
    ))
  }

  // 获取下面那个房屋列表数据 (逻辑)
  getHouseList = async value => {
    Toast.loading('正在加载中..', 0)

    const res = await axios.get(`http://localhost:8080/houses?cityId=${value}`)
    Toast.hide()
    console.log('房屋列表', res)
    this.setState({
      isShowList: true,
      houseList: res.data.body.list
    })
  }

  render() {
    return (
      <div className={styles.map}>
        <div className={styles.navbar}>
          <NavHeader>地图找房</NavHeader>
        </div>
        <div id="container"></div>
        {/* 房屋列表 */}
        <div
          className={[
            styles.houseList,
            this.state.isShowList ? styles.show : ''
          ].join(' ')}
        >
          <div className={styles.titleWrap}>
            <h1 className={styles.listTitle}>房屋列表</h1>
            <a className={styles.titleMore} href="/house/list">
              更多房源
            </a>
          </div>
          <div className={styles.houseItems}>{this.renderHouseList()}</div>
        </div>
      </div>
    )
  }
}

export default Map
