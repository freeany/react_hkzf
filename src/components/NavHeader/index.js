import React, { Component } from 'react'
import { NavBar } from 'antd-mobile'
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import styles from './index.module.scss'
class NavHeader extends Component {
  render() {
    const { rightContent, className } = this.props
    return (
      <div className={[className, styles.navHeader].join(' ')}>
        <NavBar
          mode="light"
          icon={<i className="iconfont icon-back"></i>}
          onLeftClick={() => this.props.history.goBack()}
          rightContent={rightContent}
        >
          {this.props.children}
        </NavBar>
      </div>
    )
  }
}
NavHeader.propTypes = {
  children: PropTypes.string.isRequired
}
export default withRouter(NavHeader)
