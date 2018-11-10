process.env.NODE_ENV = 'test'

const chai = require('chai')
const { expect } = chai
const chaiHttp = require('chai-http')
const server = require('../server')

chai.use(chaiHttp)

const { message } = require('../utils/helpers')

const test = async (pathname = '') => await chai.request(server).get(`/api/character/${pathname}`)

const keys = ['id', 'name', 'status', 'species', 'type', 'gender', 'origin', 'location', 'image', 'episode', 'url', 'created']

const expectStructure = body => {
  expect(body).to.be.an('object')
  expect(body.info).to.be.an('object')
  expect(body.results).to.be.an('array')
}

describe('/GET All characters', () => {
  it('should get all characters', async () => {
    const { body } = await test()

    expectStructure(body)
    expect(body.results).to.have.lengthOf(20)
  })

  it('should be the same length as the info count', async () => {
    const res = await test()

    const { count } = res.body.info
    const ids = Array.from({ length: count }, (v, i) => i + 1)

    const { body } = await test(ids)

    expect(body).to.be.an('array')
    expect(body).to.have.lengthOf(count)
  })

  it('should have an image/jpeg that matches the char. ID', async () => {
    const { body } = await test()

    const { count } = body.info
    const ids = Array.from({ length: count }, (v, i) => i + 1)

    ids.forEach(async id => {
      const { type } = await test(`/avatar/${id}.jpeg`)

      expect(type).to.equal('image/jpeg')
    })
  })
})

describe('/GET Single character with id: 1', () => {
  it('should get one character with id: 1', async () => {
    const { body } = await test(1)

    expect(body).to.be.an('object')
    expect(body.id).to.equal(1)
  })

  it('should have a keys', async () => {
    const { body } = await test(1)

    expect(Object.keys(body)).to.deep.equal(keys)
  })
})


describe('/GET five characters', () => {
  it('should get five characters with an array', async () => {
    const ids = [1, 2, 3, 4, 5]
    const { body } = await test(ids)

    expect(body).to.be.an('array')
    expect(body).to.have.lengthOf(ids.length)

    body.forEach(item => {
      expect(ids).to.include(item.id)
    })
  })

  it('should get five characters with a string', async () => {
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
    expect(res.body).to.have.property('error').include(message.noCharacter)
  })

  it('should get an error message with id:asdads', async () => {
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

describe('/GET characters with single query', () => {
  it('should get characters with name: Rick', async () => {
    const { body } = await test('?name=Rick')

    expectStructure(body)
    body.results.forEach(char => {
      expect(char).to.have.property('name').include('Rick')
    })
  })

  it('should get characters with status: Alive', async () => {
    const { body } = await test('?status=alive')

    expectStructure(body)
    body.results.forEach(char => {
      expect(char).to.have.property('status').include('Alive')
    })
  })

  it('should get characters with status: Alien', async () => {
    const { body } = await test('?species=alien')

    expectStructure(body)
    body.results.forEach(char => {
      expect(char).to.have.property('species').include('Alien')
    })
  })

  it('should get characters with type: Parasite', async () => {
    const { body } = await test('?type=parasite')

    expectStructure(body)
    body.results.forEach(char => {
      expect(char).to.have.property('type').include('Parasite')
    })

  })

  it('should get characters with gender: Female', async () => {
    const { body } = await test('?gender=female')

    expectStructure(body)
    body.results.forEach(char => {
      expect(char).to.have.property('gender').include('Female')
    })
  })
})

describe('/GET characters with multiple queries', () => {
  it('should get characters with name: Rick, stauts: Alive, gender: Male and species: Human', async () => {
    const { body } = await test('?name=Rick&status=alive&gender=Male&species=Human')

    expectStructure(body)
    body.results.forEach(char => {
      expect(char).to.have.property('name').include('Rick')
      expect(char).to.have.property('status').include('Alive')
      expect(char).to.have.property('gender').include('Male')
      expect(char).to.have.property('species').include('Human')
    })
  })
})

describe('/GET special characters', () => {
  it('should get characters with name: (', async () => {
    const { body } = await test('?name=(')

    expectStructure(body)
    body.results.forEach(char => {
      expect(char).to.have.property('name').include('(')
    })
  })

  it('should get characters with name: -', async () => {
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
    expect(body.info.next.slice(-1)).to.equal("2")
    expect(body.results).to.have.lengthOf(20)

    expect(body.results[0]).to.include({ id: 1 })
    expect(body.results[19]).to.include({ id: 20 })
  })

  it('should get page: 2', async () => {
    const { body } = await test('?page=2')

    expectStructure(body)
    expect(body.info.prev.slice(-1)).to.equal("1")
    expect(body.info.next.slice(-1)).to.equal("3")
    expect(body.results).to.have.lengthOf(20)

    expect(body.results[0]).to.include({ id: 21 })
    expect(body.results[19]).to.include({ id: 40 })
  })

  it('should get an error message', async () => {
    const res = await test('?page=12345')

    expect(res).to.have.status(404)
    expect(res.body).to.be.an('object')
    expect(res.body).to.have.property('error').include(message.noPage)
  })
})
