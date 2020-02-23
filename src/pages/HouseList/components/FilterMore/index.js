import React, { Component } from 'react'

import FilterFooter from '../FilterFooter'

import styles from './index.module.css'

export default class FilterMore extends Component {
  state = {
    selectFilterMoreValue: this.props.selectFilterMoreValue
  }
  // 渲染标签
  renderFilters(list) {
    // 高亮类名： styles.tagActive
    return list.map(item => {
      let isAcitve = this.state.selectFilterMoreValue.includes(item.value)
      return (
        <span
          onClick={() => this.labelActive(item.value)}
          key={item.value}
          className={[styles.tag, isAcitve ? styles.tagActive : ''].join(' ')}
        >
          {item.label}
        </span>
      )
    })
  }

  labelActive(value) {
    if (this.state.selectFilterMoreValue.includes(value)) {
      this.setState({
        selectFilterMoreValue: this.state.selectFilterMoreValue.filter(
          item => item !== value
        )
      })
    } else {
      this.setState({
        selectFilterMoreValue: [...this.state.selectFilterMoreValue, value]
      })
    }
  }
  clickMask1() {
    this.props.clickMask()
  }
  render() {
    const {
      data: { roomType, oriented, floor, characteristic },
      clickMask,
      clickSure
    } = this.props
    return (
      <div className={[styles.root, ''].join(' ')}>
        {/* 遮罩层 */}
        <div
          onClick={() => clickSure(this.state.selectFilterMoreValue)}
          className={styles.mask}
        />

        {/* 条件内容 */}
        <div className={styles.tags}>
          <dl className={styles.dl}>
            <dt className={styles.dt}>户型</dt>
            <dd className={styles.dd}>{this.renderFilters(roomType)}</dd>

            <dt className={styles.dt}>朝向</dt>
            <dd className={styles.dd}>{this.renderFilters(oriented)}</dd>

            <dt className={styles.dt}>楼层</dt>
            <dd className={styles.dd}>{this.renderFilters(floor)}</dd>

            <dt className={styles.dt}>房屋亮点</dt>
            <dd className={styles.dd}>{this.renderFilters(characteristic)}</dd>
          </dl>
        </div>

        {/* 底部按钮 */}
        <FilterFooter
          clickSure={() => clickSure(this.state.selectFilterMoreValue)}
          clickMask={clickMask}
          className={styles.footer}
        />
      </div>
    )
  }
}
