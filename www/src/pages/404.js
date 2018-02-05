import React from 'react'
import Helmet from 'react-helmet'

import config from '../../config/SiteConfig';
import Error from '../components/Error/Error';

const NotFoundPage = () => (
  <div>
    <Helmet title={`Oh Jeez! | ${config.siteTitle}`} />
    <Error  message='Oh Jeez! there is nothing here'/>
  </div>
)

export default NotFoundPage
