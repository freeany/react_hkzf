import React, { Component } from 'react'
import { Flex, Toast } from 'antd-mobile'
import SearchHeader from '../../components/SearchHeader'
import styles from './index.module.scss'
import Filter from '../HouseList/components/Filter'
import Sticky from '../../components/Sticky'
import { API } from '../../utils/API'
import { getCurrentCity } from '../../utils/index'
import HouseItem from '../../components/HouseItem'
import NoHouser from '../../components/NoHouse'
import {
  List,
  AutoSizer,
  WindowScroller,
  InfiniteLoader
} from 'react-virtualized'
class HouseList extends Component {
  state = {
    start: 1,
    end: 20,
    list: '', // 请求回来的数据列表
    count: '' // 请求回来的数据个数
  }
  onFilter = value => {
    // console.log('houselist接收到的数据为: ', value)
    this.initList(value)
  }

  // 页面初始化的时候发送数据
  componentDidMount() {
    this.initList()
  }
  async initList(value) {
    Toast.loading('加载中', 0)
    if (!this.cityId) {
      const { value } = await getCurrentCity()
      this.cityId = value
    }
    if (!value) value = {}
    const { start, end } = this.state
    const requestData = { ...value, cityId: this.cityId, start, end }
    this.requestData = requestData
    const result = await API.request({
      url: '/houses',
      params: requestData
    })
    Toast.hide()
    window.scrollTo(0, 0)
    // console.log(result, '得到的结果')
    const { list, count } = result.data.body
    this.setState({
      list,
      count
    })
  }
  rowRenderer = ({
    key, // Unique key within array of rows
    index, // Index of row within collection
    style // Style object to be applied to row (to position it)
  }) => {
    let item = this.state.list[index]
    return (
      <div key={key} style={style}>
        {this.state.list[index] ? (
          <HouseItem
            onClick={() => this.props.history.push(`/detail/${item.houseCode}`)}
            {...this.state.list[index]}
          ></HouseItem>
        ) : (
          <div>暂无数据</div>
        )}
      </div>
    )
  }

  // 无限加载的三个方法
  isRowLoaded = ({ index }) => {
    return !!this.state.list[index]
  }

  // 加载更多
  loadMoreRows = ({ startIndex, stopIndex }) => {
    return new Promise(async resolve => {
      let res = await API.get('/houses', {
        params: {
          cityId: this.cityId,
          ...this.requestData,
          start: startIndex,
          end: stopIndex
        }
      })
      // 保存数据
      this.setState({
        list: [...this.state.list, ...res.data.body.list]
      })

      resolve()
    })
  }

  renderMainList = () => {
    if (this.state.count === 0) {
      return <NoHouser>还没有房源数据</NoHouser>
    }
    return (
      <InfiniteLoader
        isRowLoaded={this.isRowLoaded}
        loadMoreRows={this.loadMoreRows}
        rowCount={+this.state.count}
      >
        {({ onRowsRendered, registerChild }) => (
          <WindowScroller>
            {({ height, isScrolling, onChildScroll, scrollTop }) => (
              <AutoSizer>
                {({ height, width }) => {
                  return (
                    <List
                      autoHeight
                      width={width}
                      height={667 - 40 - 45 - 50}
                      rowCount={+this.state.count}
                      rowHeight={120}
                      rowRenderer={this.rowRenderer}
                      isScrolling={isScrolling}
                      scrollTop={scrollTop}
                      onRowsRendered={onRowsRendered}
                      ref={registerChild}
                    />
                  )
                }}
              </AutoSizer>
            )}
          </WindowScroller>
        )}
      </InfiniteLoader>
    )
  }
  render() {
    return (
      <div className={[styles.list, 'aaa'].join(' ')}>
        {/* 搜索栏 */}
        <Flex className={styles.searchHeader}>
          <i className="iconfont icon-back" />
          <SearchHeader className={styles.listSearchHeader} />
        </Flex>
        {/* 条件筛选栏 */}
        <Sticky fixedTop={45} placeHolderTop={40}>
          <Filter onFilter={this.onFilter}></Filter>
        </Sticky>
        {this.renderMainList()}
      </div>
    )
  }
}

export default HouseList
