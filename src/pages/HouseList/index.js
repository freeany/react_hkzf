import React, { Component } from 'react'
import { Flex } from 'antd-mobile'
import SearchHeader from '../../components/SearchHeader'
import styles from './index.module.scss'
import Filter from './components/Filter'
import FilterMore from './components/FilterMore'
import FilterPicker from './components/FilterPicker'
import FilterTitle from './components/FilterTitle'
import FilterFooter from './components/FilterFooter'

class HouseList extends Component {
  render() {
    return (
      <div className={styles.list}>
        {/* 搜索栏 */}
        <Flex className={styles.searchHeader}>
          <i className="iconfont icon-back" />
          <SearchHeader className={styles.listSearchHeader} />
        </Flex>
        {/* 条件筛选栏 */}
        <Filter></Filter>
      </div>
    )
  }
}

export default HouseList
