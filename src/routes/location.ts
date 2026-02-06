import { Hono } from 'hono'
import Location from '../models/Location.js'
import { message } from '../utils/helpers.js'
import { createGetAllHandler, createGetByIdHandler } from './utils/helpers.js'

const app = new Hono()

// GET /location - Get all locations with filters and pagination
app.get('/', ...createGetAllHandler(Location, 'location', ['name', 'type', 'dimension']))

// GET /location/:id - Get location by id (or multiple ids)
app.get('/:id', ...createGetByIdHandler(Location, message.noLocation))

export default app
