import { reqLoginInfo } from '@/api/login'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'
import { logout, getInfo } from '@/api/user'
import { decrypt } from '@/utils/crypto'

const getDefaultState = () => {
  return {
    loginInfo: '',
    token: getToken(),
    name: '',
    // avatar: ''
  }
}

const state = getDefaultState()

const mutations = {
  DO_LOGIN: (state, {loginInfo}) => {
    state.loginInfo = loginInfo
  },
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  // SET_AVATAR: (state, avatar) => {
  //   state.avatar = avatar
  // }
}

const actions = {
  // user login
  async doLogin({ commit }, loginMsg) {
    // 发送异步ajax请求
    const result = await reqLoginInfo(loginMsg)
    // 提交一个mutation
    const loginInfo = result.data
    commit('SET_TOKEN', loginInfo.token)
    setToken(loginInfo.token)
    commit('DO_LOGIN', {loginInfo})
  },


  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {

        // console.log(response)
        const { data } = response
        if (!data) {
          return reject('Verification failed, please Login again.')
        }
        // const { name, avatar } = data

        const userInfo = JSON.parse(decrypt(sessionStorage.getItem('userInfo')))
        commit('SET_NAME', userInfo.userName)
        // commit('SET_AVATAR', avatar)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        removeToken() // must remove  token  first
        resetRouter()
        sessionStorage.removeItem("captcha")
        sessionStorage.removeItem("token")
        sessionStorage.removeItem("userInfo")
        commit('RESET_STATE')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

