import Vue from 'vue'
import VueRouter from 'vue-router'
import Index from '../views/index'

Vue.use(VueRouter)
export default new VueRouter({
	routes: [
		{
			path: '*',
			redirect: '/index'
		},
		{
			path: '/index',
			name: 'index',
			meta: {
				title: '企业设置'
			},
			component: Index
		}
	],
	scrollBehavior() {
		// 路由变换后，滚动至顶
		return { x: 0, y: 0 }
	}
})
