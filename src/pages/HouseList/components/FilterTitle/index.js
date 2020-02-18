import React from 'react'

import { Flex } from 'antd-mobile'

import styles from './index.module.css'

// 条件筛选栏标题数组：
const titleList = [
  { title: '区域', type: 'area' },
  { title: '方式', type: 'mode' },
  { title: '租金', type: 'price' },
  { title: '筛选', type: 'more' }
]

const FilterTitle = props => {
  return (
    <Flex align="center" className={styles.root}>
      {titleList.map((item, index) => {
        const isSelected = index === props.isSelected ? styles.selected : ''
        return (
          <Flex.Item key={item.title}>
            {/* 选中类名： selected */}
            <span
              onClick={() => props.changeSelected(index)}
              className={[styles.dropdown, isSelected].join(' ')}
            >
              <span>{item.title}</span>
              <i className="iconfont icon-arrow" />
            </span>
          </Flex.Item>
        )
      })}
    </Flex>
  )
}

export default FilterTitle
