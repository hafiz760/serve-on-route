import { URLS } from '../config/url'
import { store } from '../store'
import { login, updateUser } from '../store/reducers/session'
import http from '../utility/http'

export const fetchUserSessionInformation = async () => {
  try {
    const r = (await http.get(URLS.USER_SESSION_INFORMATION)).data
    if (r.account && r.profile) {
      await store.dispatch(updateUser({
        user: r
      }))
    }
  } catch (e) {
  }
}

export const initiateUserSession = async (token) => {
  try {
    const headers = {
      token
    }
    const r = (await http.get(URLS.USER_SESSION_INFORMATION, { headers })).data
    if (r.account && r.profile) {
      await store.dispatch(login({
        user: r,
        token: token
      }))
      return true
    }
  } catch (e) {
  }
  return false
}
