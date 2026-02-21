import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export const characters = JSON.parse(fs.readFileSync(path.join(__dirname, 'characters.json'), 'utf-8'))

export const locations = JSON.parse(fs.readFileSync(path.join(__dirname, 'locations.json'), 'utf-8'))

export const episodes = JSON.parse(fs.readFileSync(path.join(__dirname, 'episodes.json'), 'utf-8'))
