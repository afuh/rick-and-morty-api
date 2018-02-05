import React from 'react'
import PropTypes from 'prop-types';
import EditIcon from "react-icons/lib/go/pencil"

import config from '../../../config/SiteConfig';

import styles from './MarkdownFooter.module.sass'

const MarkdownFooter = ({ page, position }) => (
  <div className={styles.wrapper} style={{position}}>
    <a className={styles.anchor} href={`${config.github}/blob/master/www/src/pages${page.slice(0,-1)}.md`}>
      <EditIcon style={{ fontSize: 20, position: `relative`, top: -2 }} />
      <span style={{marginLeft: "0.5em"}}>edit this page</span>
    </a>
  </div>
)

MarkdownFooter.propTypes = {
  page: PropTypes.string.isRequired,
  position: PropTypes.string.isRequired,
}

export default MarkdownFooter
