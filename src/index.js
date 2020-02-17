import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import 'react-app-polyfill/ie11'
import 'react-app-polyfill/stable'
import './index.css'
import 'antd-mobile/dist/antd-mobile.css'
// 引入字体图标的颜色
import './asstes/fonts/iconfont.css'
import 'react-virtualized/styles.css'

ReactDOM.render(<App></App>, document.getElementById('root'))
