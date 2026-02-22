import { dbConfig } from '../../config.js'

/**
 * Creates the query and skip values for a findAndCount operation based on the provided configuration and parameters.
 *
 * @param config Configuration object specifying:
 *  - `fields`: which fields can be filtered
 *  - `prefixMatchFields`: optional list of fields that should use prefix matching
 * @param params Parameters object containing the values to filter by and the page number.
 * @param limit The number of items to return per page.
 *
 * @returns An object containing the `skip` value and the `query` object for the findAndCount operation.
 */
export const generateFilterOptions = (
  config: {
    fields: readonly string[]
    prefixMatchFields?: string[]
  },
  params: Record<string, unknown>
) => {
  const page = Number(params.page) || 1
  const skip = (page - 1) * dbConfig.pagination.limit

  const buildRegex = (field: string, value?: string) => {
    if (!value) return /.*/

    const escaped = value.replace(/[^\w\s]/g, '\\$&')

    if (config.prefixMatchFields?.includes(field)) {
      return new RegExp(`^${escaped}`, 'i')
    }

    return new RegExp(escaped, 'i')
  }

  return {
    skip,
    query: Object.fromEntries(
      config.fields.map((field) => {
        const value = params[field] as string | undefined
        return [field, buildRegex(field, value)]
      })
    ),
  }
}
