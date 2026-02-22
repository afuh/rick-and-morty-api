import { Hono } from 'hono'
import Location from '../models/Location.js'
import { message, filterConfig } from '../config.js'
import { createGetAllHandler } from './factories/createGetAllHandler.js'
import { createGetByIdHandler } from './factories/createGetByIdHandler.js'

const app = new Hono()

// GET /location - Get all locations with filters and pagination
app.get('/', ...createGetAllHandler(Location, 'location', filterConfig.filters.location))

// GET /location/:id - Get location by id (or multiple ids)
app.get('/:id', ...createGetByIdHandler(Location, message.noLocation))

export default app
