import Vue from 'vue'
import App from './App.vue'
import VueNeo4j from 'vue-neo4j'
import Vuex from 'vuex'
import store from './store'

Vue.config.productionTip = false
Vue.use(VueNeo4j)
Vue.use(Vuex)

new Vue({
  render: h => h(App),
  store
}).$mount('#app')
