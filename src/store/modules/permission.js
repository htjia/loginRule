import { asyncRouterMap, constantRouterMap } from '@/router'
import { getRouters } from '@/api/background/menuManager'
import { getUserId } from '@/utils/auth'

/**
 * 通过meta.role判断是否与当前用户权限匹配
 * @param roles
 * @param route
 */
// function hasPermission(roles, route) {
//   if (route.meta && route.meta.roles) {
//     return roles.some(role => route.meta.roles.includes(role))
//   } else {
//     return true
//   }
// }

// 查询路由按钮权限
function selectRouterFuntion(routes, path) {
  console.log(routes)
  let returnFunId = ''
  routes.forEach(route => {
    const tmp = { ...route }
    if (route.path === path) {
      returnFunId = route.funIds
    } else {
      if (tmp.children.length > 0) {
        tmp.children.forEach(iroute => {
          if (iroute.path === path) {
            returnFunId = iroute.funIds
          } else {
            if (iroute.children.length > 0) {
              iroute.children.forEach(iiroute => {
                if (iiroute.path === path) {
                  returnFunId = iiroute.funIds
                }
              })
            }
          }
        })
      }
    }
  })
  return returnFunId
}
/**
 * 递归过滤异步路由表，返回符合用户角色权限的路由表
 * @param routes asyncRouterMap
 * @param roles
 */
function filterResRouter(routes) {
  const pathList = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (tmp.children.length > 0) {
      tmp.children.forEach(iRoute => {
        pathList.push(iRoute.path)
        if (iRoute.children.length > 0) {
          iRoute.children.forEach(iiRoute => {
            pathList.push(iiRoute.path)
          })
        }
      })
    }
    pathList.push(tmp.path)
  })

  return pathList
}
function filterAsyncRouter(routes, roles) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (roles.includes(route.path)) {
      if (tmp.children) {
        tmp.children = filterAsyncRouter(tmp.children, roles)
      }
      res.push(tmp)
    }
  })

  return res
}

const permission = {
  state: {
    routers: constantRouterMap,
    addRouters: [],
    resRouter: []
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers
      state.routers = constantRouterMap.concat(routers)
    }
  },
  actions: {
    GenerateRoutes({ commit }, data) {
      return new Promise(resolve => {
        const { routers } = data
        // console.log(selectRouterFuntion(routers, 'myWorkflow'))
        console.log(routers)
        console.log(asyncRouterMap)
        const roles = filterResRouter(routers)
        const accessedRouters = filterAsyncRouter(asyncRouterMap, roles)
        console.log(accessedRouters)
        commit('SET_ROUTERS', accessedRouters)
        resolve()
      })
    },
    GetFunIds({ commit }, { routers, path }) {
      return new Promise(resolve => {
        console.log(routers)
        console.log(path)
        const ids = selectRouterFuntion(routers, path)
        resolve(ids)
      })
    }
  }
}

export default permission
