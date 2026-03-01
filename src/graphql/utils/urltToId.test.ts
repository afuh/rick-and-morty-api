import { describe, test, expect } from 'vitest'
import { urlToId } from './urlToId.js'

const baseURL = 'https://test.com/api/character'

describe('urlToId', () => {
  test.each([
    [`${baseURL}/1`, [1]],
    [`${baseURL}/1000`, [1000]],
    [`${baseURL}/`, [0]],
    [`${baseURL}/v2/character/100`, [100]],
    [
      [`${baseURL}/10`, `${baseURL}/`, `${baseURL}/20`],
      [10, 0, 20],
    ],
    [[], []],
    [`${baseURL}/123abc`, [0]],
    [['invalid-url'], [0]],
    ['invalid-url', [0]],
  ])('single string: %s -> %o', (input, expected) => {
    expect(urlToId(input)).toEqual(expected)
  })
})
