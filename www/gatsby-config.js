require('dotenv').config({path: '.env.production'});
const config = require('./config/siteConfig')
const autoprefixer = require('autoprefixer')

module.exports = {
  siteMetadata: {
    siteUrl: config.siteUrl,
  },
  plugins: [
    'gatsby-plugin-react-helmet',
    'gatsby-plugin-sitemap',
    'gatsby-plugin-catch-links',
    `gatsby-transformer-yaml`,
    {
      resolve: 'gatsby-transformer-remark',
      options: {
        plugins: [
          `gatsby-remark-autolink-headers`,
          {
            resolve: `gatsby-remark-prismjs`,
            options: {
              classPrefix: "language-",
            },
          },
        ],
      },
    },
    {
			resolve: 'gatsby-plugin-google-analytics',
			options: {
				trackingId: process.env.GATSBY_GOOGLE || process.env.GOOGLE,
        anonymize: true,
			}
		},
    {
			resolve: 'gatsby-plugin-postcss-sass',
			options: {
				postCssPlugins: [
					autoprefixer(),
				],
				precision: 8
			}
    },
    {
      resolve: 'gatsby-plugin-typography',
      options: {
        pathToConfigModule: `src/utils/typography.js`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `src`,
        path: `${__dirname}/src/`,
      },
    },
    {
			resolve: 'gatsby-plugin-nprogress',
			options: {
				color: config.themeColor,
        showSpinner: false
			}
		},
  ],
};
