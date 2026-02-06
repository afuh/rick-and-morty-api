// TODO: Why is this test file separated from the others tests? Should we merge them?

import { describe, test, expect } from 'vitest'
import app from '../../index.js'
import { message } from '../../utils/helpers.js'

describe('Route helpers', () => {
  test('should return 404 when array format returns empty results', async () => {
    const res = await app.request('/api/character/[99991,99992,99993]')
    expect(res.status).toBe(404)

    const body = await res.json()
    expect(body).toHaveProperty('error', message.noCharacter)
  })

  test('should return 404 when comma-separated format returns empty results', async () => {
    const res = await app.request('/api/location/99991,99992,99993')
    expect(res.status).toBe(404)

    const body = await res.json()
    expect(body).toHaveProperty('error', message.noLocation)
  })
})

describe('Pagination', () => {
  test('should handle page parameter correctly', async () => {
    const res = await app.request('/api/character?page=2')
    expect(res.status).toBe(200)

    const body = await res.json()
    expect(body.info.prev).not.toBeNull()
  })

  test('should handle invalid page gracefully', async () => {
    const res = await app.request('/api/character?page=abc')
    expect(res.status).toBe(200) // Should default to page 1

    const body = await res.json()
    expect(body.info.prev).toBeNull()
  })
})
