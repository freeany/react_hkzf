import React, { Component } from 'react'
import { getCurrentCity, API } from '../../../../utils'

import FilterTitle from '../FilterTitle'
import FilterPicker from '../FilterPicker'
import FilterMore from '../FilterMore'

import styles from './index.module.css'

export default class Filter extends Component {
  state = {
    isSelected: 0,
    //  通过  this.state.isShowPicker 的方式来控制<div></div> 的显示与隐藏太过于浪费。
    //  应该通过类的方式(display)
    isShowPicker: false,
    // 对不点确定进行的控制
    previousSelected: 0,
    // 筛选条件
    conditionData: '',
    getTitleConditionData: '',
    col: 1
  }
  componentDidMount() {
    this.getCityData()
  }

  //  数据初始化，获取到该城市 显示查询条件的数据，
  getCityData = async () => {
    const { value } = await getCurrentCity()
    const result = await API(`/houses/condition?id=${value}`)
    this.setState({
      conditionData: result.data.body
    })
  }
  // 根据用户点击对数据进行假数据数据结构的的封装，然后返回给picker组件
  // 点击标题， 对应的title高亮
  changeSelected = index => {
    // 对数据进行过滤
    const {
      area,
      characteristic,
      floor,
      oriented,
      price,
      rentType,
      roomType,
      subway
    } = {
      ...this.state.conditionData
    }
    let finallyConditionData = []
    let col = 1
    switch (index) {
      case 0:
        finallyConditionData = [area, subway]
        col = 3
        break
      case 1:
        finallyConditionData = rentType
        col = 1
        break
      case 2:
        finallyConditionData = price
        col = 1
        break
      default:
        index = 3
        finallyConditionData = ''
        break
    }

    this.setState({
      // 控制title选中的样式
      isSelected: index,
      isShowPicker: index === 3 ? false : true,
      // 这个的意思 当点击取消或mask的时候，将isSelected还是更新为上个值， 确定的时候，将isSelected的存到这里来。
      previousSelected: this.state.isSelected,
      getTitleConditionData: finallyConditionData,
      col: col
    })
  }

  // 点击mask, 将 遮罩 与 picker 隐藏, 并将isSelected的值更新为上个数据（previousSelected）
  clickMask = e => {
    e.persist()
    this.setState({
      isShowPicker: false,
      isSelected: this.state.previousSelected
    })
  }

  // 点击确定， 提交信息， 将previousSelected的数据更新为isSelecte，遮罩与picker隐藏
  clickSure = e => {
    e.persist()
    console.log('提交信息')
    this.setState({
      isShowPicker: false,
      previousSelected: this.state.isSelected
    })
  }
  render() {
    const isShow = this.state.isShowPicker ? '' : styles.show
    return (
      <div className={styles.root}>
        {/* 前三个菜单的遮罩层 */}
        <div
          onClick={e => this.clickMask(e)}
          className={[styles.mask, isShow].join(' ')}
        />
        <div className={styles.content}>
          {/* 标题栏 */}
          <FilterTitle
            changeSelected={this.changeSelected}
            isSelected={this.state.isSelected}
          />
          {/* 前三个菜单对应的内容： */}
          <FilterPicker
            className={isShow}
            clickMask={this.clickMask}
            clickSure={this.clickSure}
            getTitleConditionData={this.state.getTitleConditionData}
            col={this.state.col}
          />
          {/* 最后一个菜单对应的内容： */}
          {/* <FilterMore /> */}
        </div>
      </div>
    )
  }
}
