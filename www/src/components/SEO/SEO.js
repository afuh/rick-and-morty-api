import React from 'react';
import Helmet from 'react-helmet';
import PropTypes from 'prop-types';

import config from '../../../config/SiteConfig';

const SEO = ({ postNode, postPath, postSEO }) => {
  let image
  let title;
  let description;
  let postURL;
  const realPrefix = config.pathPrefix === '/' ? '' : config.pathPrefix;

  if (postSEO) {
    const postMeta = postNode.frontmatter;
    title = postMeta.title;
    description = postNode.excerpt;
    postURL = config.siteUrl + realPrefix + postPath;
    image = config.siteUrl + realPrefix + postMeta.cover
  } else {
    title = config.siteTitle;
    description = config.siteDescription;
    image = config.siteUrl + realPrefix + config.siteimage
  }
  const blogURL = config.siteUrl + config.pathPrefix;
  const schemaOrgJSONLD = [
    {
      '@context': 'http://schema.org',
      '@type': 'WebSite',
      url: blogURL,
      name: title,
      alternateName: config.siteTitleAlt ? config.siteTitleAlt : '',
    },
  ];
  if (postSEO) {
    schemaOrgJSONLD.push([
      {
        '@context': 'http://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            item: {
              '@id': postURL,
              name: title,
            },
          },
        ],
      },
      {
        '@context': 'http://schema.org',
        '@type': 'BlogPosting',
        url: blogURL,
        name: title,
        alternateName: config.siteTitleAlt ? config.siteTitleAlt : '',
        headline: title,
        image: {
          '@type': 'ImageObject',
        },
        description,
      },
    ]);
  }
  return (
    <Helmet>
      <meta name="description" content={description} />
      <meta name="image" content={image} />
      <script type="application/ld+json">
        {JSON.stringify(schemaOrgJSONLD)}
      </script>
      <meta property="og:locale" content="en_EN" />
      <meta property="og:site_name" content={config.ogSiteName} />
      <meta property="og:url" content={postSEO ? postURL : blogURL} />
      {postSEO ? <meta property="og:type" content="article" /> : null}
      <meta property="og:title" content={title} />
      <meta property="og:type" content="video.movie" />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:image:type" content="image/jpeg" />
      <meta property="og:image:width" content="1280" />
      <meta property="og:image:height" content="720" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta
        name="twitter:creator"
        content={config.userTwitter ? config.userTwitter : ''}
      />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:url" content={config.siteUrl} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <link rel="shortcut icon" href={config.favicon}/>
    </Helmet>
  );
};

SEO.propTypes = {
  postNode: PropTypes.object,
  postPath: PropTypes.string,
  postSEO: PropTypes.bool,
}

export default SEO;
