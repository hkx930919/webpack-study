// import dayjs from 'dayjs'
// import './css/index.css'
// import pyq from './image/pyq.png'
// import './other/d'

import(/* webpackChunkName: 'second.a' */ './a.js')
import(/* webpackChunkName: 'second.b' */ './b.js')

// import './a'
// import './b'
// console.log('second page')

// console.log('修改了吗')
// console.log('修改了吗22222222')
// console.log('修改了吗22222223')
import App from './App'
import router from './router'
import store from './store'
import Vue from 'vue'

new Vue({
	el: '#wrapper',
	router,
	store,
	render: h => h(App)
})
import util from '../util'
util.log(1)
util.warn(2)
util.error(3)
util.add(2, 9)
util.reduce(2, 9)
