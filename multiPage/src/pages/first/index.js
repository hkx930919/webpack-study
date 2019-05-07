// import dayjs from 'dayjs'
// import './css/index.css'
// import pyq from './image/pyq.png'
// import './other/d'
// import { getDataFromUrl } from 'hkx-util'

// console.log('first page')
import(/* webpackChunkName: 'first.a' */ './a.js')
import(/* webpackChunkName: 'first.b' */ './b.js')
// console.log('在first页面做修改')
import App from './App'
import router from './router'
import store from './store'
import Vue from 'vue'
console.log(1)

new Vue({
	el: '#first',
	router,
	store,
	render: h => h(App)
})
