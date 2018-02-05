import React from 'react'
import PropTypes from 'prop-types';

import styles from './Footer.module.sass'
import statistics from '../../data/statistics.yaml'

const Statics = ({ title, count }) => (
  <div style={{margin: "4px 8px"}}>
    <span className={styles.counts}>{title.toUpperCase()}: {count}</span>
  </div>
)

Statics.propTypes = {
  title: PropTypes.string.isRequired,
  count: PropTypes.number.isRequired,
}

const Footer = () => {
  const date = new Date()
  return(
    <footer className={styles.wrapper}>
      <div className={styles.statistics}>
        {statistics.map((res, i) => (
          <Statics
            key={i}
            title={res.title}
            count={res.count}
          />
        ))}
      </div>

      <div>
        <span >❮❯ by <a href="http://axelfuhrmann.com/">Axel Fuhrmann</a></span>{` `}
        <span>{date.getFullYear()}</span>
      </div>

    </footer>
  )
}


export default Footer
