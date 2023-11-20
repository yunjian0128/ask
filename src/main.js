import Vue from 'vue'
import App from './App'
import './uni.promisify.adaptor'

Vue.config.productionTip = false

App.mpType = 'app'

//引入UI框架
import uView from "uview-ui";
Vue.use(uView);

const app = new Vue({
  ...App
})

app.$mount()

// 挂载请求封装
require('./services/request')(app)
