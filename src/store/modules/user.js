import { login, logout, getInfo } from '@/api/login'
import {
  getToken,
  setToken,
  removeToken,
  removeUserName,
  getUserName,
  setUserName,
  getRoles,
  setRoles,
  removeRoles,
  setAvatar,
  removeAvatar,
  getAvatar
} from '@/utils/auth'

const user = {
  state: {
    token: getToken(),
    name: getUserName(),
    avatar: getAvatar(),
    roles: getRoles(),
    permission: [],
    permissionList: JSON.parse(localStorage.getItem('PERMISSION_LIST')) || [],
    privilege: []
  },

  getters: {
    getPrivilege(state) {
      return state.privilege
    },
    getPermission(state) {
      return state.permission
    },
    getPermissionList(state) {
      return state.permissionList
    },
    getToken(state) {
      return state.token
    }
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_PERMISSION(state, permission) {
      state.permission = permission
    },
    SET_PERMISSION_LIST(state, permissionList) {
      state.permissionList = permissionList
      sessionStorage.setItem('PERMISSION_LIST', JSON.stringify(permissionList))
    },
    SET_PRIVILEGE(state, privilege) {
      var tmp = []
      if (!privilege) {
        privilege = []
      }
      if (privilege.length <= 0) {
        return
      }
      privilege.forEach(p => {
        tmp.push(p.name)
      })
      state.privilege = tmp
    }
  },

  actions: {
    // 登录
    Login({ commit }, userInfo) {
      const username = userInfo.username.trim()
      return new Promise((resolve, reject) => {
        login(username, userInfo.password)
          .then(response => {
            const data = response.data
            setToken(data.token)
            // setUserName(userInfo.username)
            setUserName(data.name)
            setRoles(data.roleId)
            setAvatar(data.avatar)
            commit('SET_TOKEN', data.token)
            // commit('SET_NAME', userInfo.username)
            commit('SET_NAME', data.name)
            commit('SET_ROLES', data.roleId)
            commit('SET_AVATAR', data.avatar)
            commit('SET_PERMISSION', data.permission)
            commit('SET_PERMISSION_LIST', data.permissionList)
            resolve()
          })
          .catch(error => {
            reject(error)
          })
      })
    },

    // 获取用户信息
    GetInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        getInfo(state.token)
          .then(response => {
            const data = response.data
            commit('SET_ROLES', data.roleId)
            commit('SET_NAME', data.name)
            commit('SET_AVATAR', data.avatar)
            commit('SET_PERMISSION', data.permission)
            commit('SET_PERMISSION_LIST', data.permissionList)
            resolve(response)
          })
          .catch(error => {
            reject(error)
          })
      })
    },

    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout(state.token)
          .then(() => {
            commit('SET_TOKEN', '')
            commit('SET_ROLES', [])
            commit('SET_PERMISSION', [])
            commit('SET_PERMISSION_LIST', [])
            commit('SET_PRIVILEGE', [])
            removeToken()
            removeUserName()
            removeRoles()
            removeAvatar()
            resolve()
          })
          .catch(error => {
            reject(error)
          })
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        removeToken()
        resolve()
      })
    },

    setPermission({ commit }, permission) {
      commit('SET_PERMISSION', permission)
    },

    setPermissionList({ commit }, permissionList) {
      commit('SET_PERMISSION_LIST', permissionList)
    },

    setPrivilege({ commit }, privilege) {
      commit('SET_PRIVILEGE', privilege)
    }
  }
}

export default user
