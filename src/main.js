import Vue from 'vue'
import App from './App.vue'
import VueNeo4j from 'vue-neo4j'

Vue.config.productionTip = false
Vue.use(VueNeo4j)

new Vue({
  render: h => h(App),
}).$mount('#app')
