import { describe, test, expect } from 'vitest'
import { generateFilterOptions } from './generateFilterOptions.js'

describe('generateFilterOptions', () => {
  const limit = 20

  test('calculates skip from page', () => {
    const { skip } = generateFilterOptions({ fields: ['name'] }, { page: 3 })

    expect(skip).toBe((3 - 1) * limit)
  })

  test('defaults page to 1 when missing or falsy', () => {
    const r1 = generateFilterOptions({ fields: ['name'] }, {})
    expect(r1.skip).toBe(0)

    const r2 = generateFilterOptions({ fields: ['name'] }, { page: '0' })
    expect(r2.skip).toBe(0)
  })

  test('treats regex special characters as literals', () => {
    const { query } = generateFilterOptions({ fields: ['name'] }, { name: 'rick?+*' })

    const re = query.name

    expect(re.test('rick?+*')).toBe(true)
    expect(re.test('rickkkkk')).toBe(false)
  })

  test('does not match female when filtering male with prefixMatch', () => {
    const { query } = generateFilterOptions({ fields: ['gender'], prefixMatchFields: ['gender'] }, { gender: 'male' })

    const re = query.gender

    expect(re.test('male')).toBe(true)
    expect(re.test('MALE')).toBe(true)
    expect(re.test('female')).toBe(false)
  })

  test('returns /.*/ when value is missing', () => {
    const { query } = generateFilterOptions({ fields: ['name', 'status'] }, { name: undefined })

    expect(query.name.source).toBe('.*')
    expect(query.status.source).toBe('.*')
  })

  test('builds query for all configured fields', () => {
    const { query } = generateFilterOptions(
      { fields: ['name', 'status', 'species'] },
      { name: 'rick', status: 'alive' }
    )
    expect(Object.keys(query).sort()).toEqual(['name', 'species', 'status'].sort())
  })
})
