import axios from 'axios'
// import urlParse from 'url-parse'
import Config from 'react-native-config'


import { getComponentId, getIsAppReady, navigateReset } from '@navigation'
import { store } from '../store'

const instance = axios.create({
  baseURL: Config.API_URL
})

instance.defaults.headers.common.Accept = 'application/json'

instance.interceptors.request.use(async (config) => {
  const state = store.getState()

  /*
  config.headers['X-Oc-Merchant-Id'] = '123'
  if (config.url != 'session') {
    const token = state.session.token
    config.headers['X-Oc-Session'] = token
  }
  */

  if (config.url == 'oauth2/token/client_credentials') {
    config.headers.Authorization = 'Basic ZWNvMjQ6ZWNvLndkaXRlY2h5QDEzNA'
  } else {
    const token = state.session.token
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

/*
instance.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (typeof error.response === 'object') {
      switch (error.response.status) {
        case 405:
        // error('Request failed')
          break
        case 419:
        // error('Your CSRF token is too old. Please wait we are reloading')
          break
        case 401:
        // error('Your session has expired. Please login.')
          if (getIsAppReady()) {
            window.setTimeout(async () => {
              navigateReset('UserLogout')
            }, 1500)
          }
          break
        case 403:
        // error('Your access denied to this request.')
          break
        case 422:
          return error.response
        default:
      }
    }
    return Promise.reject(error)
  }
)
*/

export default instance
