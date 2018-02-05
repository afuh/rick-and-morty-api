/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

const { createFilePath } = require(`gatsby-source-filesystem`)
const path = require(`path`)

exports.onCreateNode = ({ node, getNode, boundActionCreators }) => {
  const { createNodeField } = boundActionCreators
  if (node.internal.type === `MarkdownRemark`) {
   const slug = createFilePath({ node, getNode, basePath: `pages` })
   createNodeField({
     node,
     name: `slug`,
     value: slug,
   })
  }
}

exports.createPages = ({ graphql, boundActionCreators }) => {
	const { createPage } = boundActionCreators

	return new Promise((resolve, reject) => {
		const component = path.resolve('src/templates/markdown.js')
		resolve(
			graphql(
				`
        {
          projects: allMarkdownRemark {
            edges {
              node {
                fields {
                  slug
                }
              }
            }
          }
        }
      `
			).then(result => {
				if (result.errors) {
					console.log(result.errors)
					reject(result.errors)
				}

				result.data.projects.edges.forEach(edge => {
					createPage({
						path: edge.node.fields.slug,
						component,
						context: {
							slug: edge.node.fields.slug,
						}
					})
				})
			})
		)
	})
}
