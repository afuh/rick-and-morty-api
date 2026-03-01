import { describe, test, expect, vi } from 'vitest'
import app from '../../app.js'
import Character from '../../models/Character.js'

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

  test('should handle unhandled exceptions and return 500', async () => {
    // Suppress console error output during test
    vi.spyOn(console, 'error').mockImplementation(() => {})

    const findAndCountSpy = vi.spyOn(Character, 'findAndCount').mockRejectedValueOnce(new Error('test error for 500'))

    const res = await app.request('/api/character')

    expect(res.status).toBe(500)
    const body = await res.json()
    expect(body).toEqual({ error: 'Internal Server Error' })

    findAndCountSpy.mockRestore()
  })
})
