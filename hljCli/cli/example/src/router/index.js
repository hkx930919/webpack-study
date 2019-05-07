import Vue from 'vue'
import VueRouter from 'vue-router'

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
      title: '首页',
      component: () => import('../views/index')
    }
  ],
  scrollBehavior() {
    // 路由变换后，滚动至顶
    return { x: 0, y: 0 }
  }
})
