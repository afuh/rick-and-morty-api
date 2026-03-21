import { Hono } from 'hono'
import Character from '../models/Character.js'
import { message, filterConfig } from '../config.js'
import { createGetAllHandler } from './factories/createGetAllHandler.js'
import { createGetByIdHandler } from './factories/createGetByIdHandler.js'

const app = new Hono()

// GET /character - Get all characters with filters and pagination
app.get('/', ...createGetAllHandler(Character, 'character', filterConfig.filters.character))

// GET /character/:id - Get character by id (or multiple ids)
app.get('/:id', ...createGetByIdHandler(Character, message.noCharacter))

export default app
