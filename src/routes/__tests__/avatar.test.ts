import { describe, test, expect } from 'vitest'
import app from '../../index.js'

describe('/api/character/avatar', () => {
  test('should serve character avatar image', async () => {
    const res = await app.request('/api/character/avatar/1.jpeg')
    expect(res.status).toBe(200)
    expect(res.headers.get('content-type')).toBe('image/jpeg')
  })

  test('should return 404 for avatar root', async () => {
    const res = await app.request('/api/character/avatar')
    expect(res.status).toBe(404)

    const body = await res.json()
    expect(body).toHaveProperty('error')
  })
})
