import { collection } from '../../utils/helpers.js'

// Helper to build findAndCount response with pagination info
export const buildFindAndCountResponse = <T>(results: T[], count: number, skip: number) => {
  // If no results found, return null info
  if (results.length === 0) {
    return {
      results,
      info: {
        count: null,
        pages: null,
        next: null,
        prev: null,
      },
    }
  }

  const page = Math.floor(skip / collection.limit) + 1
  const pages = Math.ceil(count / collection.limit)

  return {
    results,
    info: {
      count,

      pages,
      next: page < pages ? page + 1 : null,
      prev: page > 1 ? page - 1 : null,
    },
  }
}
