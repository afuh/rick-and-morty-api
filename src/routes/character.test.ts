import { describe, test, expect } from 'vitest'
import app from '../index.js'
import { message } from '../utils/helpers.js'

const keys = [
  'id',
  'name',
  'status',
  'species',
  'type',
  'gender',
  'origin',
  'location',
  'image',
  'episode',
  'url',
  'created',
]

describe('GET /api/character', () => {
  test('should get all characters with pagination', async () => {
    const res = await app.request('/api/character')
    expect(res.status).toBe(200)

    const body = await res.json()
    expect(body).toHaveProperty('info')
    expect(body).toHaveProperty('results')
    expect(body.results).toHaveLength(20)
  })

  test('should have valid pagination info', async () => {
    const res = await app.request('/api/character')
    const body = await res.json()

    expect(body.info).toHaveProperty('count')
    expect(body.info).toHaveProperty('pages')
    expect(body.info).toHaveProperty('next')
    expect(body.info).toHaveProperty('prev')
    expect(body.info.prev).toBeNull() // first page
  })

  describe('Get /api/character pagination', () => {
    test('should get page: 1', async () => {
      const res = await app.request('/api/character?page=1')
      const body = await res.json()

      expect(body.info.prev).toBeNull()
      expect(body.info.next.slice(-1)).toEqual('2')
      expect(body.results).toHaveLength(20)

      expect(body.results[0]).toMatchObject({ id: 1 })
      expect(body.results[19]).toMatchObject({ id: 20 })
    })

    test('should get page: 42', async () => {
      const res = await app.request('/api/character?page=42') // last page
      const body = await res.json()

      expect(body.info.prev.slice(-1)).toEqual('1')
      expect(body.info.next).toBeNull()
      expect(body.results).toHaveLength(6)
    })

    test('should get an error message', async () => {
      const res = await app.request('/api/character?page=12345')

      expect(res.status).toBe(404)
      const body = await res.json()
      expect(body).toBeInstanceOf(Object)
      expect(body).toHaveProperty('error')
      expect(body.error).toContain(message.noPage)
    })

    test('should keep query strings in pagination links', async () => {
      const res = await app.request('/api/character?name=rick&badParam=asdasd')
      const body = await res.json()

      expect(body.info.next).toContain('name=rick')
      expect(body.info.next).not.toContain('badParam=asdasd')
      expect(body.info.prev).toBeNull()
    })
  })

  test('should filter by name', async () => {
    const res = await app.request('/api/character?name=Rick')
    expect(res.status).toBe(200)

    const body = await res.json()
    body.results.forEach((char: any) => {
      expect(char.name.toLowerCase()).toContain('rick')
    })
  })

  test('should filter by status', async () => {
    const res = await app.request('/api/character?status=Alive')
    const body = await res.json()

    body.results.forEach((char: any) => {
      expect(char.status).toBe('Alive')
    })
  })

  test('should filter by species', async () => {
    const res = await app.request('/api/character?species=Human')
    const body = await res.json()

    body.results.forEach((char: any) => {
      expect(char.species.toLowerCase()).toContain('human')
    })
  })

  test('should filter by gender', async () => {
    const res = await app.request('/api/character?gender=Male')
    const body = await res.json()

    body.results.forEach((char: any) => {
      expect(char.gender).toBe('Male')
    })
  })

  test('should sanitize query params (trim whitespace)', async () => {
    const res = await app.request('/api/character?name=%20%20rick%20%20')
    expect(res.status).toBe(200)

    const body = await res.json()
    expect(body.results.length).toBeGreaterThan(0)
    expect(body.results[0].name).toContain('Rick')
  })
})

describe('GET /api/character/:id', () => {
  test('should get single character by id', async () => {
    const res = await app.request('/api/character/1')
    expect(res.status).toBe(200)

    const body = await res.json()
    expect(body).toHaveProperty('id', 1)
    expect(body).toHaveProperty('name')
    expect(Object.keys(body).sort()).toEqual(keys.sort())
  })

  test('should get multiple characters with comma-separated ids', async () => {
    const res = await app.request('/api/character/1,2,3')
    expect(res.status).toBe(200)

    const body = await res.json()
    expect(Array.isArray(body)).toBe(true)
    expect(body).toHaveLength(3)
    expect(body[0].id).toBe(1)
    expect(body[1].id).toBe(2)
    expect(body[2].id).toBe(3)
  })

  test('should get multiple characters with JSON array format', async () => {
    const res = await app.request('/api/character/[1,2,3,4,5]')
    expect(res.status).toBe(200)

    const body = await res.json()
    expect(Array.isArray(body)).toBe(true)
    expect(body).toHaveLength(5)
  })

  test('should return 404 for non-existent character', async () => {
    const res = await app.request('/api/character/99999')
    expect(res.status).toBe(404)

    const body = await res.json()
    expect(body).toHaveProperty('error', message.noCharacter)
  })

  test('should return 400 for invalid id', async () => {
    const res = await app.request('/api/character/asdasd')
    expect(res.status).toBe(400)

    const body = await res.json()
    expect(body).toHaveProperty('error', message.badParam)
  })

  test('should return 500 for malformed array [1,2', async () => {
    const res = await app.request('/api/character/[1,2')
    expect(res.status).toBe(500)

    const body = await res.json()
    expect(body).toHaveProperty('error', message.badArray)
  })

  test('should return 500 for malformed array 1,2]', async () => {
    const res = await app.request('/api/character/1,2]')
    expect(res.status).toBe(500)

    const body = await res.json()
    expect(body).toHaveProperty('error', message.badArray)
  })

  test('should return 500 for invalid JSON array [1,asdasd]', async () => {
    const res = await app.request('/api/character/[1,asdasd]')
    expect(res.status).toBe(500)

    const body = await res.json()
    expect(body).toHaveProperty('error', message.badArray)
  })
})

describe('GET /api/character/avatar', () => {
  test('should return 404 for avatar root', async () => {
    const res = await app.request('/api/character/avatar')
    expect(res.status).toBe(404)

    const body = await res.json()
    expect(body).toHaveProperty('error')
  })

  test('should serve character avatar image', async () => {
    const res = await app.request('/api/character/avatar/1.jpeg')
    expect(res.status).toBe(200)
    expect(res.headers.get('content-type')).toBe('image/jpeg')
  })
})
