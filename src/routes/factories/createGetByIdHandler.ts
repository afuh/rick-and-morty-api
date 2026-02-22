import { createFactory } from 'hono/factory'
import type { Model } from 'mongoose'
import { message } from '../../config.js'
import type { buildFindAndCountResponse } from '../../models/utils/buildFindAndCountResponse.js'

const factory = createFactory()

interface ModelWithStatics<T> extends Model<T> {
  findAndCount(params: Record<string, unknown>): Promise<ReturnType<typeof buildFindAndCountResponse>>
}

/**
 * Generic handler factory to get a resource by id (or multiple ids).
 * @param Model The Mongoose model to query.
 * @param noResourceMessage The message to return if the resource is not found.
 *
 * @returns A Hono Factory for the specified resource.
 */
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
