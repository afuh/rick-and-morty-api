import { describe, test, expect } from 'vitest'
import { urlToId } from './helpers.js'

// TODO: workaround, for the DB not to fail when running tests. We should find a better solution for this,
// When we change the DB connection to be in-memory, we can remove this workaround and run all tests without worrying about the DB state.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import app from '../../index.js'

const baseURL = 'https://test.com/api/character'

describe('urlToId', () => {
  describe('single URL string', () => {
    test('extracts ID from URL ending with number', () => {
      const result = urlToId(`${baseURL}/1`)
      expect(result).toEqual([1])
    })

    test('extracts multi-digit ID', () => {
      const result = urlToId(`${baseURL}/826`)
      expect(result).toEqual([826])
    })

    test('returns [0] when URL has no trailing number', () => {
      const result = urlToId(`${baseURL}/`)
      expect(result).toEqual([0])
    })

    test('returns [0] when URL is invalid', () => {
      const result = urlToId('invalid-url')
      expect(result).toEqual([0])
    })
  })

  describe('array of URL strings', () => {
    test('extracts IDs from multiple URLs', () => {
      const urls = [`${baseURL}/1`, `${baseURL}/2`, `${baseURL}/3`]
      const result = urlToId(urls)
      expect(result).toEqual([1, 2, 3])
    })

    test('handles mixed valid and invalid URLs', () => {
      const urls = [`${baseURL}/10`, `${baseURL}/`, `${baseURL}/20`]
      const result = urlToId(urls)
      expect(result).toEqual([10, 0, 20])
    })

    test('handles large IDs', () => {
      const urls = [`${baseURL}/999`, `${baseURL}/1000`]
      const result = urlToId(urls)
      expect(result).toEqual([999, 1000])
    })

    test('handles empty array', () => {
      const result = urlToId([])
      expect(result).toEqual([])
    })
  })

  describe('edge cases', () => {
    test('always returns an array, never a single number', () => {
      const result = urlToId(`${baseURL}/1`)
      expect(Array.isArray(result)).toBe(true)
      expect(result.length).toBe(1)
    })

    test('extracts only the last number in the URL', () => {
      const result = urlToId(`${baseURL}/v2/character/100`)
      expect(result).toEqual([100])
    })
  })
})
