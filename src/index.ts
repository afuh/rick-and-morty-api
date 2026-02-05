import 'dotenv/config'
import { serve } from '@hono/node-server'
import { Hono } from 'hono'

const app = new Hono()

const PORT = process.env.PORT || 8080

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

serve(
  {
    fetch: app.fetch,
    port: Number(PORT),
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`)
  }
)
