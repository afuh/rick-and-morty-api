import React from 'react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'

import SEO from '../components/SEO/SEO';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import config from '../../config/SiteConfig';

import '../css/prism.scss'
import '../css/globals.sass'

const Template = ({ children, location }) => (
  <div>
    <Helmet title={config.siteTitle} />
    <SEO />
    <Header location={location} />
    <main>
      {children()}
    </main>
    <Footer />
  </div>
)

Template.propTypes = {
  children: PropTypes.func.isRequired,
  location: PropTypes.object.isRequired,
}

export default Template
