import Vuex from 'vuex';
import Vue from 'vue'
import neo from './neo'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    neo
  }
})
