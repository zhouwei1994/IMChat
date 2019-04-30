import Vue from 'vue';
import Router from 'vue-router';
import { routerMode } from '@/config/constPool';
import store from '@/config/store';
Vue.use(Router);
//路由配置
const routes = [{
  path: '/',
  name: 'home',
  meta: {
    //缓存当前页面并取消动画跳转
    keepAlive: true
  },
  component: resolve => require(['@/page/home/home.vue'], resolve)
},
{
  path: '/friends',
  name: 'friends',
  meta: {
    keepAlive: true
  },
  component: resolve => require(['@/page/friends/friends.vue'], resolve)
},
{
  path: '/blogList',
  name: 'blogList',
  meta: {
    keepAlive: true
  },
  component: resolve => require(['@/page/blog/blogList.vue'], resolve)
},
{
  path: '/my',
  name: 'my',
  meta: {
    keepAlive: true
  },
  component: resolve => require(['@/page/my/my.vue'], resolve)
},
{
  path: '/chat/:toUser',
  name: 'chat',
  component: resolve => require(['@/page/home/chat.vue'], resolve)
},
{
  path: '/login',
  name: 'login',
  component: resolve => require(['@/page/user/login.vue'], resolve)
},
{
  path: '/regisrty',
  name: 'regisrty',
  component: resolve => require(['@/page/user/regisrty.vue'], resolve)
},
{
  path: '/userInfo',
  name: 'userInfo',
  component: resolve => require(['@/page/my/userInfo.vue'], resolve)
},
{
  path: '/blogDetails/:objId',
  name: 'blogDetails',
  component: resolve => require(['@/page/blog/blogDetails.vue'], resolve)
}];
let router = new Router({
  //模式
  mode: routerMode,
  //代码检查
  // strict: process.env.NODE_ENV !== 'production',
  //页面滚动
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      if (from.meta.keepAlive) {
        from.meta.savedPosition = document.body.scrollTop || document.documentElement.scrollTop;
      }
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            x: 0,
            y: to.meta.savedPosition || 0
          })
        }, 500)
      })
    }
  },
  routes,
  "router-link-active": "active",
  "linkExactActiveClass": "active",
});
//页面加载时
let historyPage = new Array;
router.beforeEach(function (to, from, next) {
  //缓存列表有说明是后退-删除缓存列表里的当前页面名称
  if (historyPage.includes(to.name)) {
    //判断是否是缓存的页面
    if (to.meta.keepAlive) {
      store.commit('setDirection', "fade");
      store.commit('setKeepAliveList', to.name);
      historyPage = new Array;
    } else {
      store.commit('setDirection', "out");
      var index = historyPage.indexOf(from.name);
      if (index >= 0) {
        historyPage.splice(index, 1);
      }
    }
  } else {
    //判断是否是缓存的页面
    if (to.meta.keepAlive) {
      store.commit('setDirection', "fade");
      store.commit('setKeepAliveList', to.name);
      historyPage = new Array;
    } else {
      store.commit('setDirection', "in");
      historyPage.push(to.name);
    }
  }
  //页面加载前
  store.commit('setLoading', true);
  next();
});
//页面销毁时
router.afterEach(function () {
  store.commit('setLoading', false);
});
export default router;