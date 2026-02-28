import { describe, test, expect, afterEach, beforeEach, vi } from 'vitest'
import app from '../../app.js'
import { message } from '../../config.js'

describe('Avatars', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn())
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  test('should serve character avatar image', async () => {
    const mockImageData = new Uint8Array([1, 2, 3])

    const mockResponse = new Response(mockImageData, {
      status: 200,
      headers: {
        'Content-Type': 'image/jpeg',
      },
    })

    vi.mocked(fetch).mockResolvedValue(mockResponse)

    const res = await app.request('/api/character/avatar/1.jpeg')

    expect(fetch).toHaveBeenCalledWith(`${process.env.AVATARS_ENDPOINT}/1.jpeg`)
    expect(res.status).toBe(200)
    expect(res.headers.get('content-type')).toBe('image/jpeg')
    expect(res.headers.get('cache-control')).not.toBeNull()
  })

  test.each(['error', '1.png', 'abc.jpg', '1.jpegexe'])('should return 404 for invalid file "%s"', async (filename) => {
    const res = await app.request(`/api/character/avatar/${filename}`)

    expect(res.status).toBe(404)
    expect(fetch).not.toHaveBeenCalled()

    const body = await res.json()
    expect(body).toEqual({ error: message.noPage })
  })

  test('should return 404 when external service fails', async () => {
    const mockResponse = new Response(null, { status: 404 })
    vi.mocked(fetch).mockResolvedValue(mockResponse)

    const res = await app.request('/api/character/avatar/99999.jpeg')

    expect(res.status).toBe(404)
    expect(fetch).toHaveBeenCalled()

    const body = await res.json()
    expect(body).toEqual({ error: message.noPage })
  })
})
