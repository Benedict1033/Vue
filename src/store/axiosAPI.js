import axios from 'axios'
import { useQuasar } from 'quasar'
import PG from './plugin.js'

const $q = useQuasar()
const instance = axios.create({
  headers: {
    'Content-Type': 'application/json; charset=utf-8',
    // 'Access-Control-Allow-Origin': process.env.ROOT_URL,
    Accept: 'application/json'
  },
  url: 'https://localhost:44350//api//',
  method: 'post',
  //   baseURL: process.env.API_URL,
  timeout: 180000
})

instance.interceptors.request.use(
  function (config) {
    // PG.setProgressBar(true)
    return config
  },
  function (error) {
    // PG.setProgressBar(false)
    console.log(error)
    PG.setSnackBar(error.message + ', URL:' + error.request.responseURL, 'negative')
    return Promise.reject(error)
  }
)

instance.interceptors.response.use(
  function (res) {
    // PG.setProgressBar(false)

    if (res.data) {
      return res
    } else {
      console.log('[axiosAPI] response false', res)
      PG.setSnackBar(res.data.Message, 'negative')
      return Promise.reject(res)
    }
  },
  function (error) {
    // PG.setProgressBar(false)
    console.log('response error', error.request)
    PG.setSnackBar(error.message + ', URL:' + error.request.responseURL, 'negative')
    return Promise.reject(error)
  }
)

export default {
  instance
}
