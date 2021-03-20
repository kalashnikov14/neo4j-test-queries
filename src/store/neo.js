export default {
  state: {
    dbLog: []
  },
  actions: {
    addData({commit}, x){
      commit('addData', x)
    },
    clearData({commit}){
      commit('clearData')
    }
  },
  mutations: {
    addData(state, x){
      state.dbLog = x
    },
    clearData(state){
      state.links = []
    }
  },
  getters: {
    getDbLog(state){
      return state.dbLog
    }
  }
}
