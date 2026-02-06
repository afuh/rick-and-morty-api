import { createFactory } from 'hono/factory'
import type { Model } from 'mongoose'
import type { Context } from 'hono'
import { baseUrl, collection, message } from '../../utils/helpers.js'
import type { buildFindAndCountResponse } from '../../models/utils/helpers.js'

const factory = createFactory()

type Resource = 'character' | 'location' | 'episode'

interface ModelWithStatics<T> extends Model<T> {
  findAndCount(params: Record<string, unknown>): Promise<ReturnType<typeof buildFindAndCountResponse>>
}

// Helper to build pagination info
export const buildPaginationInfo = (
  info: ReturnType<typeof buildFindAndCountResponse>['info'],
  resource: Resource,
  c: Context
) => {
  // if the query isn't undefined and it's an allowed query for the path
  const queryString = Object.entries(c.req.query())
    .filter(([key]) => collection.queries[resource].includes(key))
    .map(([key, value]) => `${key}=${value}`)
    .join('&')

  const qr = queryString ? `&${queryString}` : ''

  return {
    count: info.count,
    pages: info.pages,
    next: info.next ? `${baseUrl}/${resource}?page=${info.next}${qr}` : null,
    prev: info.prev ? `${baseUrl}/${resource}?page=${info.prev}${qr}` : null,
  }
}

// Generic handler to get all resources
export const createGetAllHandler = <T>(Model: ModelWithStatics<T>, resource: Resource, filterKeys: string[]) => {
  return factory.createHandlers(async (c) => {
    const page = Number(c.req.query('page')) || 1

    // Build params: page + filters from query string
    const params: Record<string, unknown> = { page }
    filterKeys.forEach((key) => {
      const value = c.req.query(key)
      if (value) params[key] = value.trim()
    })

    const { results, info } = await Model.findAndCount(params)

    // If no results and page > 1, return 404
    if (results.length === 0 && page > 1) {
      return c.json({ error: message.noPage }, 404)
    }

    return c.json({
      info: buildPaginationInfo(info, resource, c),
      results,
    })
  })
}

// Generic handler to get by ID
export const createGetByIdHandler = <T>(Model: ModelWithStatics<T>, noResourceMessage: string) => {
  return factory.createHandlers(async (c) => {
    const id = c.req.param('id')

    if (!id) {
      return c.json({ error: message.badParam }, 400)
    }

    // If it has brackets [1,2,3], parse as JSON
    if (/\[.+\]$/.test(id)) {
      try {
        const ids = JSON.parse(id)
        const data = await Model.find({ id: { $in: ids } })

        if (data.length === 0) {
          return c.json({ error: noResourceMessage }, 404)
        }

        return c.json(data)
      } catch {
        return c.json({ error: message.badArray }, 500)
      }
    }

    // If it has malformed brackets, error
    if (/\[|\]/.test(id)) {
      return c.json({ error: message.badArray }, 500)
    }

    // If it's an array of ids (comma-separated)
    if (id.includes(',') && id.length > 1) {
      const ids = id.split(',').map((i) => parseInt(i.trim()))
      const data = await Model.find({ id: { $in: ids } })

      if (data.length === 0) {
        return c.json({ error: noResourceMessage }, 404)
      }

      return c.json(data)
    }

    // If it's a single id
    const numId = parseInt(id)
    if (Number.isNaN(numId)) {
      return c.json({ error: message.badParam }, 400)
    }

    const data = await Model.findOne({ id: numId })

    if (!data) {
      return c.json({ error: noResourceMessage }, 404)
    }

    return c.json(data)
  })
}
