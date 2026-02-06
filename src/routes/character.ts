import { Hono } from 'hono'
import Character from '../models/Character.js'
import { message } from '../utils/helpers.js'
import { createGetAllHandler, createGetByIdHandler } from './utils/helpers.js'

const app = new Hono()

// GET /character - Get all characters with filters and pagination
app.get('/', ...createGetAllHandler(Character, 'character', ['name', 'type', 'status', 'species', 'gender']))

// GET /character/:id - Get character by id (or multiple ids)
app.get('/:id', ...createGetByIdHandler(Character, message.noCharacter))

export default app
