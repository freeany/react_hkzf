import React from 'react'

import PropTypes from 'prop-types'

import { REACT_APP_URL as BASE_URL } from '../../utils'
import styles from './index.module.css'

const NoHouse = ({ children }) => (
  <div className={styles.root}>
    <img
      className={styles.img}
      src={BASE_URL + '/img/not-found.png'}
      alt="暂无数据"
    />
    <p className={styles.msg}>{children}</p>
  </div>
)

NoHouse.propTypes = {
  // children: PropTypes.string.isRequired
  // node 任意类型
  children: PropTypes.node.isRequired
  // children: PropTypes.oneOfType([PropTypes.string, PropTypes.array]).isRequired
}

export default NoHouse
