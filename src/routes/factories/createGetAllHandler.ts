import { createFactory } from 'hono/factory'
import type { Model } from 'mongoose'
import { BASE_URL, filterConfig, message } from '../../config.js'
import type { buildFindAndCountResponse } from '../../models/utils/buildFindAndCountResponse.js'

type Resource = 'character' | 'location' | 'episode'

interface ModelWithStatics<T> extends Model<T> {
  findAndCount(params: Record<string, unknown>): Promise<ReturnType<typeof buildFindAndCountResponse>>
}

const factory = createFactory()

/**
 * Builds pagination information for a given resource
 *
 * @param info The pagination info from the database query.
 * @param resource The type of resource ('character', 'location', 'episode').
 * @param query The query parameters from the request.
 *
 * @returns An object containing pagination info and URLs for next and previous pages.
 */
const buildPaginationInfo = (
  info: ReturnType<typeof buildFindAndCountResponse>['info'],
  resource: Resource,
  query: Record<string, string>
) => {
  // if the query isn't undefined and it's an allowed query for the path
  const queryString = Object.entries(query)
    .filter(([key]) => (filterConfig.filters[resource] as readonly string[]).includes(key))
    .map(([key, value]) => `${key}=${value}`)
    .join('&')

  const qr = queryString ? `&${queryString}` : ''

  return {
    count: info.count,
    pages: info.pages,
    next: info.next ? `${BASE_URL}/${resource}?page=${info.next}${qr}` : null,
    prev: info.prev ? `${BASE_URL}/${resource}?page=${info.prev}${qr}` : null,
  }
}

/**
 * Generic handler factory to get all resources with pagination and filtering.
 * @param Model The Mongoose model to query.
 * @param resource The type of resource ('character', 'location', 'episode').
 * @param filterKeys The keys to filter by from the query string.
 *
 * @returns A Hono Factory for the specified resource.
 */
export const createGetAllHandler = <T>(
  Model: ModelWithStatics<T>,
  resource: Resource,
  filterKeys: readonly string[]
) => {
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
      info: buildPaginationInfo(info, resource, c.req.query()),
      results,
    })
  })
}
