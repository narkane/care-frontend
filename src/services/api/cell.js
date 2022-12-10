import axios from 'axios'

export default {
  fetchRegion(payload) {
    return axios.post(
      `${process.env.VUE_APP_API_URL}/cell/fetchRegion`,
      payload
    )
  },
  colorCell(payload) {
    return axios.post(`${process.env.VUE_APP_API_URL}/cell/colorCell`, payload)
  },
  inspectCell(payload) {
    return axios.post(
      `${process.env.VUE_APP_API_URL}/cell/inspectCell`,
      payload
    )
  }
}
