import * as types from '@/store/mutation-types'
import router from '@/router'
import api from '@/services/api/signup'
import { buildSuccess, handleError } from '@/utils/utils.js'

import axios from 'axios'

const getters = {
  user: (state) => state.user
  // token: (state) => state.token,
  // isTokenSet: (state) => state.isTokenSet
}

const actions = {
  REGISTER: async (context, payload) => {
    const { data } = await axios.post(
      `${process.env.VUE_APP_API_URL}/users/register`,
      payload
    )

    context.commit('SAVE_USER', data.user)
    console.log(`user created: ${JSON.stringify(data)}`)

    // Set Authorization Header and localStorage
    axios.defaults.headers.common.Authorization = `Bearer ${data.token}`
    localStorage.setItem('token', JSON.stringify(data.token))
  },
  EDIT_USER: async (context, payload) => {
    console.log('payload: ', payload)
    const { data } = await axios.put(
      `${process.env.VUE_APP_API_URL}/users/edit`,
      payload
    )

    context.commit('SAVE_USER', data)
    console.log(`user info updated: ${JSON.stringify(data)}`)

    // Set Authorization Header and localStorage
    // axios.defaults.headers.common.Authorization = `Bearer ${data.token}`
    // localStorage.setItem('token', JSON.stringify(data.token))
  },
  LOGIN: async (context, payload) => {
    // const { data } = await axios.post('http://127.0.0.1:8000/api/login', payload)
    const { data } = await axios.post(
      `${process.env.VUE_APP_API_URL}/users/login`,
      payload
    )

    // ADD TOKEN TO RES on API/LOGIN!!!
    context.commit('SAVE_USER', data.user)
    console.log(`logged in: ${JSON.stringify(data.user)}`)

    // Set Authorization Header and localStorage
    axios.defaults.headers.common.Authorization = `Bearer ${data.token}`
    localStorage.setItem('token', JSON.stringify(data.token))
  },
  VALIDATE_USER_TOKEN: async (context) => {
    // returns user if token validates
    const token = axios.defaults.headers.common.Authorization
    if (token !== null) {
      const user = await axios.post(
        `${process.env.VUE_APP_API_URL}/users/tokenIsValid`,
        null
      )

      console.log(user.data)
      context.commit(types.SAVE_USER, user.data)

      // returns user
      return user
    }
    console.log('null token!')

    return false
  }
  //      commit(types.SHOW_LOADING, true)
}

const mutations = {
  // [types.SAVE_TOKEN](state, token) {
  //   state.token = token
  //   state.isTokenSet = true
  // },
  // [types.LOGOUT](state) {
  //   state.user = null
  //   state.token = null
  //   state.isTokenSet = false
  // },
  [types.SAVE_USER](state, user) {
    console.log(`mutation, ${user}`)
    state.user = user
  }
}

const state = {
  user: null
}

export default {
  getters,
  actions,
  mutations,
  state
}
