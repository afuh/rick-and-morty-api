process.env.NODE_ENV = 'test'

const chai = require('chai')
const { expect } = chai
const chaiHttp = require('chai-http')

const server = require('../server')
const { message } = require('../utils/helpers')

chai.use(chaiHttp)

const test = async (pathname = '') => chai.request(server).get(`/api/episode/${pathname}`)

const keys = ['id', 'name', 'air_date', 'episode', 'characters', 'url', 'created']

const expectStructure = body => {
  expect(body).to.be.an('object')
  expect(body.info).to.be.an('object')
  expect(body.results).to.be.an('array')
}

describe('/GET All episodes', () => {
  it('should get all episodes', async () => {
    const { body } = await test()

    expectStructure(body)
    expect(body.results).to.have.lengthOf(10)
  })

  it('should be the same length as the info count', async () => {
    const res = await test()

    const { count } = res.body.info
    const ids = Array.from({ length: count }, (v, i) => i + 1)

    const { body } = await test(ids)

    expect(body).to.be.an('array')
    expect(body).to.have.lengthOf(count)
  })
})

describe('/GET Single episode with id: 1', () => {
  it('should get one episode with id: 1', async () => {
    const { body } = await test(1)

    expect(body).to.be.an('object')
    expect(body.id).to.equal(1)
  })

  it('should have a keys', async () => {
    const { body } = await test(1)

    expect(Object.keys(body)).to.deep.equal(keys)
  })
})

describe('/GET five episodes', () => {
  it('should get five episodes with an array', async () => {
    const ids = [1, 2, 3, 4, 5]
    const { body } = await test(ids)

    expect(body).to.be.an('array')
    expect(body).to.have.lengthOf(ids.length)

    body.forEach(item => {
      expect(ids).to.include(item.id)
    })
  })

  it('should get five episodes with a string', async () => {
    const ids = '1,2,3,4,5'
    const { body } = await test(ids)

    expect(body).to.be.an('array')
    expect(body).to.have.lengthOf(ids.replace(/,/g, '').length)

    body.forEach(item => {
      expect(ids).to.include(item.id)
    })
  })
})

describe('/GET Error messages', () => {
  it('should get an error message with id:12345', async () => {
    const res = await test('12345')

    expect(res).to.have.status(404)
    expect(res.body).to.be.an('object')
    expect(res.body).to.have.property('error').include(message.noEpisode)
  })

  it('should get an error message with id:asdasd', async () => {
    const res = await test('asdasd')

    expect(res).to.have.status(500)
    expect(res.body).to.be.an('object')
    expect(res.body).to.have.property('error').include(message.badParam)
  })

  it('should get an error message with id:1,2]', async () => {
    const res = await test('1,2]')

    expect(res).to.have.status(500)
    expect(res.body).to.be.an('object')
    expect(res.body).to.have.property('error').include(message.badArray)
  })

  it('should get an error message with id:[1,2', async () => {
    const res = await test('[1,2')

    expect(res).to.have.status(500)
    expect(res.body).to.be.an('object')
    expect(res.body).to.have.property('error').include(message.badArray)
  })

  it('should get an error message with id:[1,asdasd]', async () => {
    const res = await test('[1,asdasd]')

    expect(res).to.have.status(500)
    expect(res.body).to.be.an('object')
    expect(res.body).to.have.property('error').include(message.badArray)
  })
})

describe('/GET episodes with single query', () => {
  it('should get episodes with name: Pilot', async () => {
    const { body } = await test('?name=Pilot')

    expectStructure(body)
    body.results.forEach(char => {
      expect(char).to.have.property('name').include('Pilot')
    })
  })

  it('should get episodes with episode: S01E01', async () => {
    const { body } = await test('?episode=S01E01')

    expectStructure(body)
    body.results.forEach(char => {
      expect(char).to.have.property('episode').include('S01E01')
    })
  })
})

describe('/GET special characters', () => {
  it('should get episodes with name: -', async () => {
    const { body } = await test('?name=-')

    expectStructure(body)
    body.results.forEach(char => {
      expect(char).to.have.property('name').include('-')
    })
  })
})

describe('/GET pages', () => {
  it('should get page: 1', async () => {
    const { body } = await test('?page=1')

    expectStructure(body)
    expect(body.info.prev).to.have.lengthOf(0)
    expect(body.info.next.slice(-1)).to.equal('')
    expect(body.results).to.have.lengthOf(10)

    expect(body.results[0]).to.include({ id: 1 })
  })
})

describe('/GET ?page=12345 ', async () => {
  const res = await test('?page=12345')

  expect(res).to.have.status(404)
  expect(res.body).to.be.an('object')
  expect(res.body).to.have.property('error').include(message.noPage)
})
