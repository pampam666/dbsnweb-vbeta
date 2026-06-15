import { createTokenHandler } from '@21st-sdk/nextjs/server'
import { NextRequest } from 'next/server'

jest.mock('@21st-sdk/nextjs/server', () => ({
  createTokenHandler: jest.fn(() => (req: NextRequest) => Promise.resolve(new Response(JSON.stringify({ token: 'mock-token' }), { status: 200 }))),
}))

describe('api/an-token', () => {
  const originalEnv = process.env

  beforeEach(() => {
    jest.clearAllMocks()
    process.env = { ...originalEnv, API_KEY_21ST: '21st_test_api_key' }
  })

  afterAll(() => {
    process.env = originalEnv
  })

  it('should create a token handler with the API key from environment', async () => {
    const { getTokenHandler } = await import('@/app/api/an-token/route')
    getTokenHandler()
    expect(createTokenHandler).toHaveBeenCalledWith({
      apiKey: '21st_test_api_key',
    })
  })

  it('should return a token on POST request', async () => {
    const { POST } = await import('@/app/api/an-token/route')
    const req = new NextRequest('http://localhost/api/an-token', { method: 'POST' })
    const response = await POST(req)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.token).toBe('mock-token')
  })
})
