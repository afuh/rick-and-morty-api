import React from 'react'

import config from '../../config/SiteConfig';
import Home from '../components/Home/Home';

const IndexPage = () => <Home title={config.siteTitle} description={config.siteDescription} />

export default IndexPage
