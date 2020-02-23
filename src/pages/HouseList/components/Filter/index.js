import React, { Component } from 'react'
import { getCurrentCity, API } from '../../../../utils'

import FilterTitle from '../FilterTitle'
import FilterPicker from '../FilterPicker'
import FilterMore from '../FilterMore'

import { Spring } from 'react-spring/renderprops'

import styles from './index.module.css'

export default class Filter extends Component {
  state = {
    isSelected: 0,
    //  通过  this.state.isShowPicker 的方式来控制<div></div> 的显示与隐藏太过于浪费。
    //  应该通过类的方式(display)
    isShowPicker: false,
    // 对不点确定进行的控制
    previousSelected: 0,
    // 总的筛选条件
    conditionData: '',
    // 默认条件  这里确定的是由 在reactTool中对picker进行onchange事件得来的默认结果。
    selectedValues: {
      area: ['area', 'null'],
      mode: ['null'],
      price: ['null'],
      more: []
    },
    type: 'area',
    isShowMore: false
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
    // 优化： 点了title之后，为了防止滚动穿透，给body加一个overflow: hidden 即可
    document.body.classList.add(styles.clear)

    let type = ''
    switch (index) {
      case 0:
        type = 'area'
        break
      case 1:
        type = 'mode'
        break
      case 2:
        type = 'price'
        break
      default:
        type = 'more'
        break
    }
    this.setState({
      // 控制title选中的样式
      isSelected: index,
      isShowMore: true,
      isShowPicker: index === 3 ? false : true,
      // 这个的意思 当点击取消或mask的时候，将isSelected还是更新为上个值， 确定的时候，将isSelected的存到这里来。
      previousSelected: this.state.isSelected,
      type
    })
  }

  // 点击mask, 将 遮罩 与 picker 隐藏, 并将isSelected的值更新为上个数据（previousSelected）
  clickMask = e => {
    document.body.classList.remove(styles.clear)

    e.persist()
    if (this.state.isSelected !== 3) {
      this.setState({
        isShowPicker: false,
        isSelected: this.state.previousSelected
      })
    } else {
      this.setState({
        isShowMore: false
      })
    }
  }

  // 点击确定， 提交信息， 将previousSelected的数据更新为isSelecte，遮罩与picker隐藏
  //  e 即使 value
  clickSure = e => {
    document.body.classList.remove(styles.clear)
    if (!e) {
      this.setState({
        isShowPicker: false,
        isShowMore: false,
        previousSelected: this.state.isSelected
      })
      return
    }
    let type = ''
    switch (this.state.isSelected) {
      case 0:
        type = 'area'
        break
      case 1:
        type = 'mode'
        break
      case 2:
        type = 'price'
        break
      default:
        type = 'more'
        break
    }

    /* 
      需要将数据回传给houselist页面。
    */
    //  需要处理数据
    const houses = this.handleSelectValue({
      ...this.state.selectedValues,
      [type]: e
    })
    this.props.onFilter(houses)

    this.setState({
      selectedValues: {
        ...this.state.selectedValues,
        [type]: e
      },
      isShowPicker: false,
      isShowMore: false,
      previousSelected: this.state.isSelected,
      type: type
    })
  }

  // 处理需要回传给houselist的数据
  handleSelectValue(newSelect) {
    // console.log(newSelect, 'newSelect...')
    let obj = {}
    // 处理area
    if (newSelect.area.length === 2) {
      obj.area = newSelect.area[1]
    }
    if (newSelect.area.length === 3) {
      obj.area =
        newSelect.area[2] === 'null' ? newSelect.area[1] : newSelect.area[2]
    }

    // 处理mode
    obj.mode = newSelect.mode[0]
    // 处理price
    obj.price = newSelect.price[0]
    obj.more = newSelect.more.join(',')

    // console.log('处理后的obj', obj)
    return obj
  }
  renderFilterPicker() {
    const isShow = this.state.isShowPicker ? '' : styles.show
    // 如果不显示，则直接返回null即可，避免render报错。
    if (isShow) {
      return null
    }
    const index = this.state.isSelected
    const { area, price, rentType, subway } = {
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
        return null
    }
    return (
      <FilterPicker
        key={this.state.type}
        type={this.state.type}
        selectedValues={this.state.selectedValues}
        className={isShow}
        clickMask={this.clickMask}
        clickSure={this.clickSure}
        getTitleConditionData={finallyConditionData}
        col={col}
      />
    )
  }

  renderFilterMore() {
    const {
      isSelected,
      isShowMore,
      conditionData: { roomType, oriented, floor, characteristic }
    } = this.state
    if (isSelected !== 3 || !isShowMore) {
      return null
    }

    const data = { roomType, oriented, floor, characteristic }
    return (
      <FilterMore
        selectFilterMoreValue={this.state.selectedValues['more']}
        clickMask={this.clickMask}
        clickSure={this.clickSure}
        data={data}
      />
    )
  }
  renderMask() {
    //  show   即是display: none
    const isShow = this.state.isShowPicker ? '' : styles.show

    return (
      <Spring from={{ opacity: 0 }} to={{ opacity: isShow ? 0 : 1 }}>
        {props => {
          // console.log(props)
          if (props.opacity === 0) {
            return null
          }
          return (
            <div
              onClick={e => this.clickMask(e)}
              className={[styles.mask].join(' ')}
            />
          )
        }}
      </Spring>
    )
  }
  render() {
    return (
      <div className={styles.root}>
        {/* 前三个菜单的遮罩层 */}
        {this.renderMask()}
        <div className={styles.content}>
          {/* 标题栏 */}
          <FilterTitle
            changeSelected={this.changeSelected}
            isSelected={this.state.isSelected}
          />
          {/* 前三个菜单对应的内容： */}
          {this.renderFilterPicker()}
          {/* 最后一个菜单对应的内容： */}
          {this.renderFilterMore()}
        </div>
      </div>
    )
  }
}
