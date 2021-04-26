import { reqLoginInfo } from '@/api/login'

const state = {
  loginInfo: '',
}

const mutations = {
  DO_LOGIN: (state, {loginInfo}) => {
    state.loginInfo = loginInfo
  },
}

const actions = {
  // user login
  async doLogin({ commit }, loginMsg) {
    // 发送异步ajax请求
    const result = await reqLoginInfo(loginMsg)
    // 提交一个mutation
    const loginInfo = result.data
    commit('DO_LOGIN', {loginInfo})
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

