/**
 * Helper to build findAndCount response with pagination info
 *
 * @param results The results of the query
 * @param count The total number of items
 * @param skip The number of items to skip
 * @param limit The number of items per page
 *
 * @returns An object containing the results and pagination info
 */
export const buildFindAndCountResponse = <T>(results: T[], count: number, skip: number, limit: number) => {
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

  const page = Math.floor(skip / limit) + 1
  const pages = Math.ceil(count / limit)

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
