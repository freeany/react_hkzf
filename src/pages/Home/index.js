import React, { Component } from 'react'
import { Route } from 'react-router-dom'
import Index from '../Index'
import HouseList from '../HouseList'
import News from '../News'
import Profile from '../Profile'
import { TabBar } from 'antd-mobile'
import './index.scss'

// 封装tabbar， 提供tabbar-item的数据, 增加程序的可维护性, 使用循环减少代码量
const tabItems = [
  {
    title: '首页',
    key: 'index',
    icon: 'icon-ind',
    // path: '/home/index'
    path: '/home'
  },
  {
    title: '找房',
    key: 'houselist',
    icon: 'icon-findHouse',
    path: '/home/houselist'
  },
  {
    title: '咨询',
    key: 'news',
    icon: 'icon-infom',
    path: '/home/news'
  },
  {
    title: '我的',
    key: 'profile',
    icon: 'icon-infom',
    path: '/home/profile'
  }
]

class Home extends Component {
  state = {
    selectedTab: this.props.location.pathname,
    // 是否隐藏tabbar
    hidden: false,
    // 是否全屏
    fullScreen: false
  }

  /* 
    如果用重定向
     <Route
      path="/home"
      render={() => <Redirect to="/home/index"></Redirect>}
     ></Route>

     则就要用下面的should钩子来进行控制selectedTab
     因为重定向之后，并没有任何操作改变selectedTab
  */
  // shouldComponentUpdate(nextProps, nextState) {
  //   if (nextProps.location.pathname !== nextState.selectedTab) {
  //     this.setState({
  //       selectedTab: nextProps.location.pathname
  //     })
  //   }
  //   return true
  // }
  render() {
    return (
      <div className="home">
        {/* 出口 */}
        {/* <Route
          path="/home"
          render={() => <Redirect to="/home/index"></Redirect>}
        ></Route> */}
        <Route exact path="/home" component={Index}></Route>
        <Route path="/home/houselist" component={HouseList}></Route>
        <Route path="/home/news" component={News}></Route>
        <Route path="/home/profile" component={Profile}></Route>
        {/* 底部 */}
        <TabBar
          noRenderContent={true}
          // 未选中tabbar的字体颜色
          unselectedTintColor="#949494"
          // 选中的tabbar的字体颜色
          tintColor="#33A3F4"
          // tabbar的整体背景颜色
          barTintColor="white"
          // 是否隐藏tabbar
          hidden={this.state.hidden}
        >
          {tabItems.map(item => {
            return (
              <TabBar.Item
                // tabbar上的文字
                title={item.title}
                // tabbar的键
                key={item.key}
                icon={<i className={'iconfont ' + item.icon}></i>}
                selectedIcon={<i className={'iconfont ' + item.icon}></i>}
                selected={this.state.selectedTab === item.path}
                onPress={() => {
                  this.setState(
                    {
                      selectedTab: item.path
                    },
                    () => {
                      this.props.history.push(item.path)
                    }
                  )
                }}
              ></TabBar.Item>
            )
          })}
        </TabBar>
      </div>
    )
  }
}

export default Home
