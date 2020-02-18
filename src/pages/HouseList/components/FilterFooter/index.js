import React from 'react'

import { Flex } from 'antd-mobile'
import PropTypes from 'prop-types'

import styles from './index.module.css'

// 点击取消，将mask 关闭， 并将 picker框 关闭
function FilterFooter({ className, style, clickMask, clickSure }) {
  return (
    <Flex style={style} className={[styles.root, className || ''].join(' ')}>
      {/* 取消按钮 */}
      <span
        onClick={clickMask}
        className={[styles.btn, styles.cancel].join(' ')}
      >
        取消
      </span>

      {/* 确定按钮 */}
      <span onClick={clickSure} className={[styles.btn, styles.ok].join(' ')}>
        确定
      </span>
    </Flex>
  )
}

// props校验
FilterFooter.propTypes = {
  className: PropTypes.string,
  style: PropTypes.object
}

export default FilterFooter
