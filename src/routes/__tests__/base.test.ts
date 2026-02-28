import { describe, test, expect } from 'vitest'
import app from '../../app.js'

describe('CORS', () => {
  test('should handle CORS preflight for REST API', async () => {
    const res = await app.request('/api', { method: 'OPTIONS' })
    expect(res.status).toBe(204)
    expect(res.headers.get('access-control-allow-origin')).toBe('*')
  })

  test('should include CORS header on REST GET', async () => {
    const res = await app.request('/api')
    expect(res.headers.get('access-control-allow-origin')).toBe('*')
  })

  test('should handle CORS preflight for GraphQL', async () => {
    const res = await app.request('/graphql', { method: 'OPTIONS' })
    expect(res.status).toBe(204)
    expect(res.headers.get('access-control-allow-origin')).toBe('*')
  })
})

describe('Error Handling', () => {
  test('should return 404 for non-existent route', async () => {
    const res = await app.request('/error')
    expect(res.status).toBe(404)
  })
})
