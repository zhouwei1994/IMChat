import Vue from 'vue';
//主组件
import App from './App';
//vue路由
import router from './router';
//vuex配置文件
import store from '@/config/store';
//常用过滤器
import filter from '@/config/filter';
Vue.use(filter);
//头部
import header from '@/components/header';
//引用rem配置
import '@/utils/rem';
Vue.config.productionTip = false;
//注册全局组件（头部）
Vue.component('zHeader', header);
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: {
    App
  }
})