import { Friday } from '@sabuj0338/axios-friday'
import { AxiosResponse } from 'axios'
import { toast } from 'sonner'

const BASE_API_URL = import.meta.env.VITE_BASE_API_URL
const ACCESS_TOKEN_KEY = import.meta.env.VITE_ACCESS_TOKEN_KEY
const REFRESH_TOKEN_KEY = import.meta.env.VITE_REFRESH_TOKEN_KEY
const REFRESH_TOKEN_API = import.meta.env.VITE_REFRESH_TOKEN_API

class MyFriday extends Friday {
  constructor(baseURL: string = BASE_API_URL) {
    super({
      baseURL: baseURL,
      refreshTokenEndpoint: REFRESH_TOKEN_API,
      accessTokenKey: ACCESS_TOKEN_KEY,
      refreshTokenKey: REFRESH_TOKEN_KEY,
      enableRefreshToken: true,
      enableAccessToken: true,
      storage: 'local'
    })
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  override resetTokens(res: AxiosResponse<any, any>): void {
    localStorage.set(ACCESS_TOKEN_KEY, res.data.accessToken)
  }

  override throwError(message: string): void {
    toast.error(message)
  }
}

export const friday = new MyFriday()
