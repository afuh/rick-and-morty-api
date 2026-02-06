import { Hono } from 'hono'
import Episode from '../models/Episode.js'
import { message } from '../utils/helpers.js'
import { createGetAllHandler, createGetByIdHandler } from './utils/helpers.js'

const app = new Hono()

// GET /episode - Get all episodes with filters and pagination
app.get('/', ...createGetAllHandler(Episode, 'episode', ['name', 'episode']))

// GET /episode/:id - Get episode by id (or multiple ids)
app.get('/:id', ...createGetByIdHandler(Episode, message.noEpisode))

export default app
