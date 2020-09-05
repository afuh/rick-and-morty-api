process.env.NODE_ENV = 'test'

const chai = require('chai')
const { expect } = chai
const chaiHttp = require('chai-http')
const server = require('../server')

chai.use(chaiHttp)

const test = async (query) => {
  const res = await chai.request(server).post('/graphql').set('content-type', 'application/json').send({ query })

  return res.body.data
}

const keys = ['count', 'pages', 'next', 'prev']

describe('[GraphQL][Info] - info', () => {
  it('Gets info about characters', async () => {
    const query = '{ characters { info { count } } }'
    const {
      characters: { info },
    } = await test(query)

    expect(info).to.be.an('object')
  })

  it('Gets info about locations', async () => {
    const query = '{ locations { info { count } } }'
    const {
      locations: { info },
    } = await test(query)

    expect(info).to.be.an('object')
  })

  it('Gets info about episodes', async () => {
    const query = '{ episodes { info { count } } }'
    const {
      episodes: { info },
    } = await test(query)

    expect(info).to.be.an('object')
  })

  it('Shows the full info section', async () => {
    const query = '{ characters { info { count pages next prev } } }'
    const {
      characters: { info },
    } = await test(query)

    expect(Object.keys(info)).to.deep.equal(keys)
    expect(info.count).to.be.an('number')
    expect(info.pages).to.be.an('number')
    expect(info.next).to.be.an('number')
    expect(info.prev).to.be.null
  })

  it('Gets the next page ', async () => {
    const query = '{ characters(page: 2) { info { count pages next prev } } }'
    const {
      characters: { info },
    } = await test(query)

    expect(info.count).to.be.an('number')
    expect(info.pages).to.be.an('number')
    expect(info.next).to.be.null
    expect(info.prev).to.be.an('number')
  })

  it('Gets null data ', async () => {
    const query = '{ characters(page: 2000) { results { id } info { count pages next prev } } }'
    const { characters } = await test(query)

    expect(characters).to.be.null
  })

  it('Prevents deep nesting', async () => {
    const query = `
      {
      	characters {
          results {
            origin {
              residents {
                name
                origin {
                  name
                }
              }
            }
          }
        }
      }
    `
    const res = await test(query)
    expect(res).to.be.undefined
  })
})
