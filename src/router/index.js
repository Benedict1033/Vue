import { route } from 'quasar/wrappers'
import { createRouter, createMemoryHistory, createWebHistory, createWebHashHistory } from 'vue-router'
import { SessionStorage } from 'quasar'
import routes from './routes'
import global from '../store/global'

export default route(function () {

  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : (process.env.VUE_ROUTER_MODE === 'history' ? createWebHistory : createWebHashHistory)

  const Router = createRouter({
    routes,
    history: createHistory(process.env.MODE === 'ssr' ? void 0 : process.env.VUE_ROUTER_BASE)
  })

  Router.beforeEach((to, from, next) => {

    let login = SessionStorage.getItem("Login")
    let right = SessionStorage.getItem("Right")

    let permission = to.meta.permission

    if (login) {
      if (!(global.history.formUrl.toLowerCase() == '/login' || global.history.formUrl.toLowerCase() === '/' || global.history.formUrl.toLowerCase() === '')) {
        next({ path: global.history.formUrl, query: global.history.query })
      } else {
        if (to.path.toLowerCase() === '/login' || to.path.toLowerCase() === '/') {
          next({ path: 'Home' })
        } else {
          if (permission && permission[0] !== right && permission[1] !== right && permission[2] !== right) {
            next({ path: '/Right' })
          } else {
            next()
          }
        }
      }
    } else {
      if (!(to.fullPath == undefined || to.fullPath == "" || to.fullPath == "/" || to.fullPath == "/login")) {
        global.setToUrl(to.path, to.query)
      }

      if (to.path.toLowerCase() === '/login') {
        next()
      } else {
        next({ path: '/login' })
      }
    }
  })

  return Router
})
