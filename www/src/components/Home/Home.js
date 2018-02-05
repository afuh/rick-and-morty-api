import React, { Component } from 'react'
import PropTypes from 'prop-types';
import Spinner from 'react-spinkit'
import moment from 'moment'

import Divider from 'material-ui/Divider';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { Card, CardMedia, CardTitle, CardText} from 'material-ui/Card';

import { shlaAPI } from '../../utils/api'
import statistics from '../../data/statistics.yaml'

import styles from './Home.module.sass'

const Text = ({title, data, last}) => {
  return (
    <div>
      <div className={styles.textWrapper} style={{padding: "8px 0"}}>
        <span>{title.toUpperCase()}</span>
        <p>{data}</p>
      </div>
      {!last && <Divider />}
    </div>
  )
}

Text.propTypes = {
  title: PropTypes.string.isRequired,
  data: PropTypes.string.isRequired,
  last: PropTypes.bool
}

const Intro = ({title, description}) => (
  <div className={styles.introWrapper} >
    <h1>{title}</h1>
    <div className={styles.subtitle}>
      <h2>{description}</h2>
      <h2>&nbsp; &nbsp; &nbsp; I got one right here, grab my terry flap&nbsp; &nbsp; &nbsp; </h2>
    </div>
  </div>
)

Intro.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
}

class Home extends Component {
  count = statistics[0].count
  chars = []
  state = {
    data: [],
  }
  randomNums(){
    while(this.chars.length < 8) {
      const num = Math.floor(Math.random() * (this.count - 1 + 1) + 1)

      if (this.chars.indexOf(num) > - 1) continue;
      this.chars[this.chars.length] = num
    }
    return this.chars
  }
  componentDidMount(){
    this.handleRequest()
  }
  handleRequest = () => {
    const randomNums = this.randomNums()
    const randomChars = randomNums.map(num => `/character/${num}`)
    const list = Promise.all(randomChars.map(char => shlaAPI.get(char).then(res => res.data)))
    list.then(data => this.setState({data}))
  }
  render(){
    const { data } = this.state
    const { title, description } = this.props

    return (
      <div>
        <Intro title={title} description={description} />

        <div className={styles.apiSection}>
          <MuiThemeProvider>
            <div className={styles.materialWrapper}>
              {
                data.length == 8 ? data.map((char, i) => {
                return (
                  <Card
                    key={i}
                    style={{width: 300, marginBottom: '12px'}}>
                    <CardMedia
                      style={{height: 300}}
                      overlay={
                        <CardTitle
                          title={char.name}
                          subtitle={"id: " + char.id + " - created " + moment(char.created).fromNow()}
                        />
                      }
                    >
                      <img src={char.image} alt={char.name}/>
                    </CardMedia>
                    <CardText>
                      <Text title='Status' data={char.status}/>
                      <Text title='Species' data={!char.type ? char.species : char.species + ', ' + char.type} />
                      <Text title='Gender' data={char.gender} />
                      <Text title='Origin' data={char.origin.name} />
                      <Text title='Last location' data={char.location.name} last/>
                    </CardText>
                  </Card>
                )}) : <Spinner name="triangle-skew-spin" color="rgb(255, 152, 0)" />
              }
            </div>
          </MuiThemeProvider>
        </div>
      </div>
    )
  }
}

Home.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
}


export default Home;
