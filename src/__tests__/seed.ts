import Character from '../models/Character.js'
import Episode from '../models/Episode.js'
import Location from '../models/Location.js'
import { characters, episodes, locations } from './fixtures/index.js'

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
    // Extract location id from URL (e.g., 'https://rickandmortyapi.com/api/location/20' -> 20)
    const originId = char.origin.url ? parseInt(char.origin.url.split('/').pop() || '0') : 0
    const locationId = char.location.url ? parseInt(char.location.url.split('/').pop() || '0') : 0

    return {
      ...char,
      created: new Date(char.created),
      origin: locationMap.get(originId) || null,
      location: locationMap.get(locationId) || null,
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
