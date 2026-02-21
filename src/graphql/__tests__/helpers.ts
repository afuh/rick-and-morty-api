import app from '../../index.js'

export const query = async (gql: string) => {
  const res = await app.request('/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: gql }),
  })

  const json = await res.json()
  return json.data
}
