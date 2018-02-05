import React from 'react';
import Helmet from 'react-helmet';
import PropTypes from 'prop-types';

import config from '../../config/SiteConfig';
import SEO from '../components/SEO/SEO';
import Sidebar from '../components/Sidebar/Sidebar';
import MarkdownFooter from '../components/MarkdownFooter/MarkdownFooter';

import styles from './markdown.module.sass'

const margin = {
  marginTop: 20
}

const Docs = ({html}) => (
  <div className={styles.wrapper}>
    <div className={styles.sidebar}>
      <Sidebar style={margin} />
    </div>
    <div className={styles.wrapperDocs} >
      <article style={margin} dangerouslySetInnerHTML={{ __html: html }}></article>
    </div>
  </div>
)

Docs.propTypes = {
  html: PropTypes.string.isRequired,
}

const About = ({html}) => (
  <div className={styles.wrapperAbout} >
    <article dangerouslySetInnerHTML={{ __html: html }}></article>
  </div>
)

About.propTypes = {
  html: PropTypes.string.isRequired,
}

const Markdown = ({ data }) => {
  const { title } = data.markdownRemark.frontmatter
  const { slug } = data.markdownRemark.fields
  const { html } = data.markdownRemark;

  return (
    <div>
      <Helmet title={`${title} | ${config.siteTitle}`} />
      <SEO postPath={slug} postNode={data.markdownRemark} postSEO />
      <div className={styles.position}>
        {
          slug.includes('documentation') ?
          <Docs html={html}/> :
          <About html={html}/>
        }
      </div>
      <MarkdownFooter page={slug} position={styles.position}/>
    </div>
  )
}

Markdown.propTypes = {
  data: PropTypes.object.isRequired,
}

export default Markdown;

export const pageQuery = graphql`
  query ProjectPostBySlug($slug: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      excerpt
      html
      frontmatter {
        title
        cover
      }
      fields {
        slug
      }
    }
  }
`;
