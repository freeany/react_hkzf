import React, { Component } from 'react'
import NavHeader from '../../components/NavHeader'
import { getCurrentCity } from '../../utils'
import axios from 'axios'

import styles from './index.module.scss'

class Map extends Component {
  componentDidMount() {
    this.fy_resolveAddress()
  }
  // 解析地址
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
    //1.根据id , 发送请求, 查看房源信息
    let res = await axios.get('http://localhost:8080/area/map', {
      params: { id }
    })
    //2. 通过 getTypeAndZoom  获取 类型(圆 or 方) + 下一次的缩放级别
    const { type, nextZoom } = this.getTypeAndZoom()
    //3. 遍历 创建 渲染物
    res.data.body.forEach(item => {
      // 创建每一个覆盖物
      this.createOverlays(type, nextZoom, item)
    })
  }
  // 2. 获取 类型 和 下一次缩放级别
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

  // 3. 创建覆盖物
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

  // 4. 创建 圆 覆盖物
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

  // 5. 创建 方  覆盖物
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
      console.log(123)
    })
    this.map.addOverlay(label)
  }

  // 创建房屋列表结构
  // 房屋列表结构
  renderHouseList = () => {
    const houseList = (
      <div className={[styles.houseList, styles.show].join(' ')}>
        <div className={styles.titleWrap}>
          <h1 className={styles.listTitle}>房屋列表</h1>
          <a className={styles.titleMore} href="/house/list">
            更多房源
          </a>
        </div>
        <div className={styles.houseItems}>
          <div className={styles.house}>
            <div className={styles.imgWrap}>
              <img
                className={styles.img}
                src="http://996houzi.com/newImg/7bk75ppj0.jpg"
                alt=""
              />
            </div>
            <div className={styles.content}>
              <h3 className={styles.title}>
                三期精装修两房，南北户型，房东诚意出租出门燎原双语
              </h3>
              <div className={styles.desc}>2室2厅1卫/82/南/阳光美景城</div>
              <div>
                <span className={[styles.tag, styles.tag1].join(' ')}>
                  近地铁
                </span>
              </div>
              <div className={styles.price}>
                <span className={styles.priceNum}>8500</span> 元/月
              </div>
            </div>
          </div>
        </div>
      </div>
    )

    return houseList
  }

  // 点击区，查看镇
  // renderOverlays_ZHEN = async id => {
  //   // 接口 : 查看房源信息
  //   let res = await axios.get('http://localhost:8080/area/map', {
  //     params: {
  //       id
  //     }
  //   })
  //   const result = res.data.body
  //   console.log(result)
  //   result.forEach(item => {
  //     const {
  //       label: name,
  //       value,
  //       count,
  //       coord: { latitude, longitude }
  //     } = item
  //     const BMap = window.BMap
  //     const point = new BMap.Point(longitude, latitude)
  //     // 添加覆盖物
  //     var opts = {
  //       position: point, // 指定文本标注所在的地理位置
  //       offset: new BMap.Size(-35, -35) //设置文本偏移量
  //     }
  //     var label = new BMap.Label('欢迎使用百度地图', opts) // 创建文本标注对象
  //     // 清除默认的文本覆盖物样式，因为下面有setContent进行覆盖
  //     label.setStyle({
  //       height: '0',
  //       border: 'none'
  //     })
  //     label.setContent(`
  //           <div class="${styles.bubble} .quCircle">
  //             <p class="${styles.name}">${name}</p>
  //             <p>${count}套</p>
  //           </div>
  //         `)
  //     label.addEventListener('click', e => {
  //       //1. 缩放级别 => 15
  //       this.map.centerAndZoom(point, 15) // 将指定的坐标解析后放到地图中心
  //       //2. 清除镇的覆盖物
  //       setTimeout(() => {
  //         this.map.clearOverlays()
  //       }, 0)
  //       //3. 渲染 小区 的 覆盖物
  //       this.renderOverlays_XIAOQU(value)
  //     })
  //     this.map.addOverlay(label) // 将文本覆盖物添加到地图上
  //   })
  // }
  // // 点击镇，查看小区
  // async renderOverlays_XIAOQU(id) {
  //   // 接口 : 查看房源信息
  //   let res = await axios.get('http://localhost:8080/area/map', {
  //     params: {
  //       id
  //     }
  //   })
  //   const result = res.data.body
  //   console.log(result)
  //   result.forEach(item => {
  //     const {
  //       label: name,
  //       value,
  //       count,
  //       coord: { latitude, longitude }
  //     } = item
  //     const BMap = window.BMap
  //     const point = new BMap.Point(longitude, latitude)
  //     // 添加覆盖物
  //     var opts = {
  //       position: point, // 指定文本标注所在的地理位置
  //       offset: new BMap.Size(-50, -10) //设置文本偏移量
  //     }
  //     var label = new BMap.Label('欢迎使用百度地图', opts) // 创建文本标注对象
  //     // 清除默认的文本覆盖物样式，因为下面有setContent进行覆盖
  //     label.setStyle({
  //       height: '0',
  //       border: 'none'
  //     })
  //     label.setContent(`
  //       <div class="${styles.rect}">
  //         <span class="${styles.housename}">${name}</span>
  //         <span class="${styles.housenum}">${count}套</span>
  //         <i class="${styles.arrow}"></i>
  //       </div>
  //     `)
  //     label.addEventListener('click', e => {
  //       //1. 缩放级别 => 15
  //       // this.map.centerAndZoom(point, 15) // 将指定的坐标解析后放到地图中心
  //       //2. 清除镇的覆盖物
  //       // setTimeout(() => {
  //       //   this.map.clearOverlays()
  //       // }, 0)
  //       //3. 渲染 小区 的 覆盖物
  //       // this.renderOverlays_XIAOQU(value)
  //     })
  //     this.map.addOverlay(label) // 将文本覆盖物添加到地图上
  //   })
  // }
  render() {
    return (
      <div className={styles.map}>
        <div className={styles.navbar}>
          <NavHeader>地图找房</NavHeader>
        </div>
        <div id="container"></div>
      </div>
    )
  }
}

export default Map
