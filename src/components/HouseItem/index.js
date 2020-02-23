import React, { Component } from 'react'
import styles from './index.module.scss'
import PropTypes from 'prop-types'
class HouseItem extends Component {
  render() {
    const { desc, houseCode, houseImg, price, tags, title } = this.props
    return (
      <div className={styles.house} key={houseCode}>
        <div className={styles.imgWrap}>
          <img
            className={styles.img}
            src={'http://localhost:8080' + houseImg}
            alt=""
          />
        </div>
        <div className={styles.content}>
          <h3 className={styles.title}>{title}</h3>
          <div className={styles.desc}>{desc}</div>
          <div>
            {tags.map((item, index) => {
              let tagClass = 'tag3'
              if (index === 0) tagClass = 'tag1'
              if (index === 1) tagClass = 'tag2'
              return (
                <span
                  key={index}
                  className={[styles.tag, styles[tagClass]].join(' ')}
                >
                  {item}
                </span>
              )
            })}
          </div>
          <div className={styles.price}>
            <span className={styles.priceNum}>{price}</span> 元/月
          </div>
        </div>
      </div>
    )
  }
}

HouseItem.prototypes = {
  desc: PropTypes.string.isRequired,
  houseCode: PropTypes.string.isRequired,
  houseImg: PropTypes.string.isRequired,
  price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  tags: PropTypes.array.isRequired,
  title: PropTypes.string.isRequired
}
export default HouseItem
