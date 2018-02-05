import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Link from 'gatsby-link'
import Back from "react-icons/lib/go/arrow-left"

import { shlaAPI } from '../../utils/api'

import styles from './Error.module.sass'

class ErrorMessage extends Component {
  state = {
    image: '',
    name: ''
  }
  componentDidMount(){
    shlaAPI.get('/character')
      .then(res => {
        this.count = res.data.info.count;
        this.handleRequest()
      })
      .catch(err => console.log(err))
  }

  handleRequest(){
    const num = Math.floor(Math.random() * (this.count - 1 + 1) + 1)

    shlaAPI.get(`/character/${num}`)
      .then(res => {
        this.setState({image: res.data.image, name: res.data.name })
      })
      .catch(err => console.log(err))
  }

  render() {
    const { image, name } = this.state
    const { message } = this.props
    return (
      <main className={styles.wrapper}>
        <p className={styles.message}>{message}</p>
        <p className={styles.message}>But I could show you a cute picture of <strong>{name}</strong>.</p>
        <div className={styles.imgWrapper}>
          {image && <img src={image} className={styles.img} alt='🐈'/>}
        </div>
        <Link to="/"><Back style={{fontSize: "40px", marginTop: "10px"}} /></Link>
      </main>
    )
  }
}

ErrorMessage.defaultProps = {
  message: "Errorooo!"
}

ErrorMessage.propTypes = {
  message: PropTypes.string.isRequired,
}

export default ErrorMessage;
