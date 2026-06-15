import { createTokenHandler } from '@21st-sdk/nextjs/server'
import { validateANSDKEnv } from '@/lib/config/env'

export const getTokenHandler = () => {
  const { API_KEY_21ST } = validateANSDKEnv()
  return createTokenHandler({
    apiKey: API_KEY_21ST,
  })
}

export const POST = (req: Request) => getTokenHandler()(req)
