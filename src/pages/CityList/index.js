import React, { Component } from 'react'
import { Toast } from 'antd-mobile'
import NavHeader from '../../components/NavHeader'
import { getCurrentCity } from '../../utils'
import { List, AutoSizer } from 'react-virtualized'
import styles from './index.module.scss'
import './index.scss'
import { setCity, API } from '../../utils'

// 暂定只有这四个城市有房源信息
const citysHavaHouse = ['北京', '上海', '深圳', '广州']

class CityList extends Component {
  state = {
    citysObj: {},
    citysIndex: [],
    rightCurrentIndex: 0
  }
  listRef = React.createRef()

  render() {
    let length = Object.keys(this.state.citysObj).length
    return (
      <div className="citylist">
        <NavHeader>城市列表</NavHeader>
        <AutoSizer>
          {({ height, width }) => {
            // console.log(height, width, 'cc')
            return (
              <List
                ref={this.listRef}
                width={width}
                height={height}
                rowCount={length}
                rowHeight={this.caculRowHeight}
                rowRenderer={this.rowRenderer}
                onRowsRendered={this.scrollToIndex}
                scrollToAlignment="start"
              />
            )
          }}
        </AutoSizer>

        {/* 索引 */}
        <ul className="city-index">{this.renderCityIndex()}</ul>
      </div>
    )
  }
  componentDidMount() {
    // 获取所有列表的数据
    this.fy_getCityList(this.getList)
  }
  // 点击城市
  selectCity = item => {
    if (citysHavaHouse.includes(item.label)) {
      setCity(item)
      Toast.info(`切换到了${item.label}`, 1, () => {
        this.props.history.goBack()
      })
    } else {
      Toast.info('该地区暂无房源信息')
    }
  }
  // 封装的 cityObj的key值 数组的排序方法
  fy_getSortCitysKeys = () => {
    let lists = Object.keys(this.state.citysObj).sort((value1, value2) => {
      if (value1 === '热门城市' || value1 === '当前城市' || value1 < value2) {
        return -1
      } else if (value1 > value2) {
        return 1
      } else {
        return 0
      }
    })
    return lists
  }
  // 渲染右侧的索引
  renderCityIndex = () => {
    const { citysIndex } = this.state
    // console.log(citysIndex)
    return citysIndex.map((item, index) => (
      <li
        onClick={() => this.clickRightIndex(index)}
        className="city-index-item"
        key={item}
      >
        {/* 高亮类名： index-active */}
        <span
          className={
            this.state.rightCurrentIndex === index ? 'index-active' : ''
          }
        >
          {item.toUpperCase()}
        </span>
      </li>
    ))
  }
  // 点击右侧索引的事件处理函数
  clickRightIndex = index => {
    console.log(index, 'index')
    this.setState(
      {
        rightCurrentIndex: index
      },
      () => {
        this.listRef.current.scrollToRow(index)
      }
    )
  }
  // 滚动左侧，让右侧元素自动到对应的索引上
  scrollToIndex = ({ startIndex }) => {
    if (startIndex !== this.state.rightCurrentIndex) {
      this.setState({
        rightCurrentIndex: startIndex
      })
    }
  }
  // 每行的高度
  caculRowHeight = ({ index }) => {
    // console.log(index)
    let lists = this.fy_getSortCitysKeys()
    const result = this.state.citysObj[lists[index]].length * 50 + 36
    return result
  }
  // 获取所有城市列表的数据
  async fy_getCityList() {
    const result = await API.get('/area/city?level=1')
    const cityLists = result.data.body
    const getCityListsObjeAndArray = this.fy_getObjAndArr(cityLists)
    const setHotCity = await this.fy_hotArea(getCityListsObjeAndArray)
    const setCurrentCity = await this.fy_getCurrentCity(setHotCity)
    // 得到的总数据
    console.log(setCurrentCity)
    const { citysObj, citysIndex } = setCurrentCity
    this.setState({
      citysObj,
      citysIndex
    })
  }
  // 长列表性能优化
  rowRenderer = ({
    key, // Unique key within array of rows
    index, // 列表集合的数据下标
    isScrolling, // 该行是否正在滚动
    isVisible, // 该行是否可见
    style // Style object to be applied to row (to position it)
  }) => {
    // console.log(index, isVisible)
    const lists = (this.fy_getSortCitysKeys && this.fy_getSortCitysKeys()) || []
    return (
      <div key={key} style={style} className={styles.city}>
        <div className={styles.title}>{lists[index].toLocaleUpperCase()}</div>
        <div>
          {this.state.citysObj[lists[index]].map(item => (
            <div
              onClick={() => this.selectCity(item)}
              className={styles.name}
              key={item.label}
            >
              {item.label}
            </div>
          ))}
        </div>
      </div>
    )
  }
  // 对获取到的数据进行处理
  /* 
    如何处理： 根据 产品需求逻辑，需要定义一种数据结构
    1.  对象的形式存放（具有房源的）城市列表
       { 'A': ['安庆'], 'B': ['北京', '宝鸡'...] }
    2. 数组的形式存放(具有房源的)城市列表的索引
      ['a', 'b', 'c', ...]
    定义好数据结构以后 要对 object 增加热门城市和当前定位， 要对Array 增加热 和  #
  */
  // 1. 定义数据结构, 组装成定义的数据结构并返回
  fy_getObjAndArr(cityLists) {
    // 这里应该对cityList做一些数据判断。就不写了
    let citysObj = {}
    let citysIndex = []
    cityLists.forEach(item => {
      let firstLetter = item.pinyin.charAt(0)
      if (firstLetter in citysObj) {
        citysObj[firstLetter].push(item)
      } else {
        citysObj[firstLetter] = [item]
        citysIndex.push(firstLetter)
      }
    })
    citysIndex = citysIndex.sort()
    return {
      citysObj,
      citysIndex
    }
  }
  // 2. 获取热门城市重新填充数据结构
  async fy_hotArea(obj) {
    const { citysObj, citysIndex } = obj
    const result = await API.get('/area/hot')
    const hotCity = result.data.body
    // console.log(result.data.body)
    citysObj['热门城市'] = hotCity
    citysIndex.unshift('热')
    return {
      citysObj,
      citysIndex
    }
  }
  // 3. 获取当前城市并重新填充数据结构
  async fy_getCurrentCity(obj) {
    const { citysObj, citysIndex } = obj
    const result = await getCurrentCity()
    citysObj['当前城市'] = [result]
    citysIndex.unshift('#')

    return {
      citysObj,
      citysIndex
    }
  }
}

export default CityList
