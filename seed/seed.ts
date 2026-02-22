import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import Location from '../src/models/Location.js'
import Episode from '../src/models/Episode.js'
import Character from '../src/models/Character.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const characters = JSON.parse(fs.readFileSync(path.join(__dirname, 'characters.json'), 'utf-8'))
const locations = JSON.parse(fs.readFileSync(path.join(__dirname, 'locations.json'), 'utf-8'))
const episodes = JSON.parse(fs.readFileSync(path.join(__dirname, 'episodes.json'), 'utf-8'))

/**
 * Seed the test database with fixture data
 */
export async function seedDatabase() {
  const insertedLocations = await Location.insertMany(locations)

  // Create a map of location id to ObjectId
  const locationMap = new Map(insertedLocations.map((loc) => [loc.id, loc._id]))

  // Insert episodes
  await Episode.insertMany(episodes)

  // Transform characters to use ObjectIds for location references
  const charactersWithRefs = characters.map((char: (typeof characters)[number]) => {
    const originId = parseInt(char.origin.url.split('/').pop() || '0')
    const locationId = parseInt(char.location.url.split('/').pop() || '0')

    return {
      ...char,
      origin: locationMap.get(originId),
      location: locationMap.get(locationId),
    }
  })

  // Insert characters
  await Character.insertMany(charactersWithRefs)
}

/**
 * Clear all collections in the test database
 */
export async function clearDatabase() {
  await Character.deleteMany({})
  await Episode.deleteMany({})
  await Location.deleteMany({})
}
