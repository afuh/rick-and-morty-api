import { Hono } from 'hono'
import Episode from '../models/Episode.js'
import { message, filterConfig } from '../config.js'
import { createGetAllHandler } from './factories/createGetAllHandler.js'
import { createGetByIdHandler } from './factories/createGetByIdHandler.js'

const app = new Hono()

// GET /episode - Get all episodes with filters and pagination
app.get('/', ...createGetAllHandler(Episode, 'episode', filterConfig.filters.episode))

// GET /episode/:id - Get episode by id (or multiple ids)
app.get('/:id', ...createGetByIdHandler(Episode, message.noEpisode))

export default app
