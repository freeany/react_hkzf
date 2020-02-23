import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styles from './index.module.scss'

class Sticky extends Component {
  state = {
    isSticky: false
  }
  contentRef = React.createRef()
  placeHolder = React.createRef()

  render() {
    return (
      <div>
        {/* 占位符 */}
        <div ref={this.placeHolder}></div>
        {/* 内容 */}
        <div
          ref={this.contentRef}
          className={this.state.isSticky ? styles.fixed : ''}
        >
          {this.props.children}
        </div>
      </div>
    )
  }
  componentDidMount() {
    window.addEventListener('scroll', this.onScroll)
  }
  onScroll = () => {
    const { fixedTop, placeHolderTop } = this.props
    const scrollTop = document.documentElement.scrollTop
    if (scrollTop >= fixedTop) {
      this.setState({
        isSticky: true
      })
      this.placeHolder.current.style.height = `${placeHolderTop}px`
    } else {
      this.setState({
        isSticky: false
      })
      this.placeHolder.current.style.height = '0'
    }
  }
  componentWillUnmount() {
    window.removeEventListener('scroll', this.onScroll)
  }
}

Sticky.prototypes = {
  fixedTop: PropTypes.number.isRequired,
  placeHolderTop: PropTypes.number.isRequired
}

export default Sticky
