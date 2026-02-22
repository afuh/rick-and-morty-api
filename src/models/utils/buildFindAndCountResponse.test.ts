import { describe, test, expect } from 'vitest'
import { buildFindAndCountResponse } from './buildFindAndCountResponse.js'

describe('buildFindAndCountResponse', () => {
  test('returns null pagination info when results are empty', () => {
    const response = buildFindAndCountResponse([], 0, 0, 10)

    expect(response).toEqual({
      results: [],
      info: {
        count: null,
        pages: null,
        next: null,
        prev: null,
      },
    })
  })

  test('calculates first page correctly', () => {
    const results = [{ id: 1 }]
    const response = buildFindAndCountResponse(results, 30, 0, 10)

    expect(response.info).toEqual({
      count: 30,
      pages: 3,
      next: 2,
      prev: null,
    })
  })

  test('calculates middle page correctly', () => {
    const results = [{ id: 11 }]
    const response = buildFindAndCountResponse(results, 30, 10, 10)

    expect(response.info).toEqual({
      count: 30,
      pages: 3,
      next: 3,
      prev: 1,
    })
  })

  test('calculates last page correctly', () => {
    const results = [{ id: 21 }]
    const response = buildFindAndCountResponse(results, 30, 20, 10)

    expect(response.info).toEqual({
      count: 30,
      pages: 3,
      next: null,
      prev: 2,
    })
  })

  test('handles count not divisible by limit', () => {
    const results = [{ id: 21 }]
    const response = buildFindAndCountResponse(results, 25, 20, 10)

    expect(response.info.pages).toBe(3)
  })
})
