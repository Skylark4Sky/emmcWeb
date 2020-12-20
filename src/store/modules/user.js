import storage from 'store'
import { getInfo, login, logout } from '@/api/modules/login'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import { welcome } from '@/utils/util'

const user = {
  state: {
    userID: '',
    token: '',
    name: '',
    welcome: '',
    avatar: '',
    roles: [],
    info: {}
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, { name, welcome }) => {
      state.name = name
      state.welcome = welcome
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_INFO: (state, info) => {
      state.info = info
    },
    SET_USERID: (state, uid) => {
      state.userID = uid
    }
  },

  actions: {
    // 登录
    Login ({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        login(userInfo).then(response => {
          const res = response.data
          const result = res.data
          // console.log('Login--->' + JSON.stringify(result))
          const tokenuserEntity = result.tokenInfo
          // console.log('data Login:' + tokenuserEntity.token + 'expire_ts' + tokenuserEntity.expire_ts)
          storage.set(ACCESS_TOKEN, tokenuserEntity.token, tokenuserEntity.expire_ts)
          commit('SET_TOKEN', tokenuserEntity.token)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetInfo ({ commit }) {
      return new Promise((resolve, reject) => {
        getInfo().then(response => {
          const res = response.data
          const result = res.data
          const userEntity = result.user
          const RoleEntity = result.permissions
          if (RoleEntity && RoleEntity.length > 0) {
            const role = {
              permissions: RoleEntity
            }
            role.permissions.map(per => {
              if (per.actionEntitySet != null && per.actionEntitySet.length > 0) {
                const action = per.actionEntitySet.map(action => { return action.action })
                per.actionList = action
              }
            })
            role.permissionList = role.permissions.map(permission => { return permission.permissionId })
            commit('SET_ROLES', role)
            commit('SET_INFO', userEntity)
            // console.log('role rebuild--->' + JSON.stringify(role))
            commit('SET_NAME', { name: userEntity.nickname, welcome: welcome() })
            commit('SET_AVATAR', userEntity.face200)
            commit('SET_USERID', userEntity.uid)
            resolve(role)
          } else {
            reject(new Error('getInfo: roles must be a non-null array !'))
          }
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 登出
    Logout ({ commit, state }) {
      return new Promise((resolve) => {
        logout(state.token).then(() => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          storage.remove(ACCESS_TOKEN)
          resolve()
        }).catch(() => {
          resolve()
        }).finally(() => {
        })
      })
    }

  }
}

export default user
