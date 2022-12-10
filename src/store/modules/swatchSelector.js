// import * as types from '@/store/mutation-types'
import api from '@/services/api/cell'
import { buildSuccess, handleError } from '@/utils/utils.js'

const getters = {
  selectedSwatch: (state) => state.selectedSwatch
}

const actions = {
  // payload should contain {
  // location: [x,y]
  // color: "FFFFFF"
  // }
  selectSwatch(context, payload) {
    context.commit('selectSwatch', payload)
    //   // !! make API call from services/api :)
    //   return new Promise((resolve, reject) => {
    //     api
    //       .colorCell(payload)
    //       .then((response) => {
    //         if (response.status === 201) {
    //           buildSuccess(
    //             {
    //               msg: 'common.SAVED_SUCCESSFULLY'
    //             },
    //             context.commit,
    //             resolve
    //           )
    //         }
    //       })
    //       .catch((error) => {
    //         handleError(error, context.commit, reject)
    //       })
    //   })
  }
}

const mutations = {
  selectSwatch(state, color) {
    state.selectedSwatch = color
  }
}

const state = {
  selectedSwatch: '#FFFFFF'
}

export default {
  state,
  getters,
  actions,
  mutations
}
