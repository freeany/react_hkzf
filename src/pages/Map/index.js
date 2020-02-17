import React, { Component } from 'react'
import NavHeader from '../../components/NavHeader'
import { getCurrentCity } from '../../utils'
import axios from 'axios'

import styles from './index.module.scss'

class Map extends Component {
  componentDidMount() {
    this.fy_resolveAddress()
  }
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
          this.renderOverlays_QU(address.value)
        } else {
          alert('您选择地址没有解析到结果!')
        }
      },
      address.label
    )
  }
  // 渲染 区 覆盖物
  renderOverlays_QU = async id => {
    // 接口 : 查看房源信息
    let res = await axios.get('http://localhost:8080/area/map', {
      params: {
        id
      }
    })
    const result = res.data.body
    console.log(result)
    result.forEach(item => {
      const {
        label: name,
        value,
        count,
        coord: { latitude, longitude }
      } = item
      const BMap = window.BMap
      const point = new BMap.Point(longitude, latitude)
      // 添加覆盖物
      var opts = {
        position: point, // 指定文本标注所在的地理位置
        offset: new BMap.Size(-35, -35) //设置文本偏移量
      }
      var label = new BMap.Label('欢迎使用百度地图', opts) // 创建文本标注对象
      // 清除默认的文本覆盖物样式，因为下面有setContent进行覆盖
      label.setStyle({
        height: '0',
        border: 'none'
      })
      label.setContent(`
            <div class="${styles.bubble} .quCircle">
              <p class="${styles.name}">${name}</p>
              <p>${count}套</p>
            </div>
          `)
      label.addEventListener('click', e => {
        //1. 缩放级别 => 13
        this.map.centerAndZoom(point, 13)
        //2. 清除区的覆盖物
        setTimeout(() => {
          this.map.clearOverlays()
        }, 0)
        //3. 渲染 镇 的 覆盖物
        this.renderOverlays_ZHEN(value)
      })
      this.map.addOverlay(label) // 将文本覆盖物添加到地图上
    })
  }

  // 点击区，查看镇
  renderOverlays_ZHEN = async id => {
    // 接口 : 查看房源信息
    let res = await axios.get('http://localhost:8080/area/map', {
      params: {
        id
      }
    })
    const result = res.data.body
    console.log(result)
    result.forEach(item => {
      const {
        label: name,
        value,
        count,
        coord: { latitude, longitude }
      } = item
      const BMap = window.BMap
      const point = new BMap.Point(longitude, latitude)
      // 添加覆盖物
      var opts = {
        position: point, // 指定文本标注所在的地理位置
        offset: new BMap.Size(-35, -35) //设置文本偏移量
      }
      var label = new BMap.Label('欢迎使用百度地图', opts) // 创建文本标注对象
      // 清除默认的文本覆盖物样式，因为下面有setContent进行覆盖
      label.setStyle({
        height: '0',
        border: 'none'
      })
      label.setContent(`
            <div class="${styles.bubble} .quCircle">
              <p class="${styles.name}">${name}</p>
              <p>${count}套</p>
            </div>
          `)
      label.addEventListener('click', e => {
        // this.renderOverlays_ZHEN(value)
        console.log(456)
      })
      this.map.centerAndZoom(point, 13) // 将指定的坐标解析后放到地图中心

      this.map.addOverlay(label) // 将文本覆盖物添加到地图上
    })
  }
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
