import Vue from 'vue';
import Vuex from 'vuex';
import { setStore, modifyJson, prompt } from '@/utils/utils';
import router from '@/router';
Vue.use(Vuex);
//全局变量
const state = {
  //加载时动画
  loading: 0,
  //跳转页面动画模式
  direction: 'fade',
  //需求缓存的页面
  keepAliveList: [],
  //用户信息
  userInfo: {},
  //聊天列表
  chatList: [],
}
//缓存浏览器的数据名称
const cacheNameList = ["userInfo", "chatList"];
//数据处理
const mutations = { //触发状态
  //取出缓存数据
  setCacheData(state) {
    for (var name of cacheNameList) {
      var data = sessionStorage.getItem(name) || localStorage.getItem(name);
      if (data) {
        var dataObj = JSON.parse(data);
        // if (/userInfo/.test(name)) {
        // if (new Date().getTime() - dataObj.time < 86400000) {
        // state[name] = dataObj.data;
        // }
        // } else {
        state[name] = dataObj;
        // }
      }
    }
  },
  //加载时动画
  setLoading(state, payload) {
    if (payload) {
      state.loading = state.loading + 1;
    } else {
      state.loading = state.loading - 1;
    }
  },
  //跳转页面动画模式
  setDirection(state, payload) {
    state.direction = payload;
  },
  //需求缓存的页面
  setKeepAliveList(state, payload) {
    if (state.keepAliveList.includes(payload.name)) {
      state.keepAliveList.push(payload.name);
    }
  },
  //储存用户信息
  setUserInfo(state, payload) {
    if (payload) {
      state.userInfo = modifyJson(payload, state.userInfo);
      setStore('userInfo', state.userInfo);
    }
  },
  //聊天列表替换
  setChatList(state, payload) {
    if (payload) {
      if (payload.data instanceof Array) {
        state.chatList = payload.data;
      } else if (payload.index >= 0) {
        console.log(payload.index);
        state.chatList.unshift(state.chatList[payload.index]);
        state.chatList.splice(payload.index + 1, 1);
        Object.keys(payload.data).forEach(key => {
          state.chatList[0][key] = payload.data[key];
        });
      } else {
        state.chatList.unshift(payload.data);
      }
      console.log(state.chatList);
      localStorage.setItem('chatList', JSON.stringify(state.chatList));
    }
  },
}
//异步处理
const actions = {
  chatUserInfo({ commit, state }, payload) {
    if (payload) {
      let routerInfo = router.history.current;
      let haveRead = 1;
      if (routerInfo.name == "chat") {
        haveRead = 0;
        if (routerInfo.params.toUser != payload.fromUser && routerInfo.params.toUser != payload.toUser) {
          prompt(payload.nickname + "给您发了一条消息：" + payload.content);
        }
      } else {
        prompt(payload.nickname + "给您发了一条消息：" + payload.content);
      }
      let isTo = false;
      state.chatList.forEach((item, index) => {
        if (item.toUser == payload.fromUser || item.toUser == payload.toUser) {
          isTo = true;
          console.log(index);
          commit("setChatList", {
            data: {
              content: payload.content,
              sendTime: payload.sendTime,
              haveRead: haveRead
            },
            index: index
          });
        }
      });
      if (!isTo) {
        if (payload.toUser == state.userInfo.id) {
          console.log(payload);
          commit("setChatList", {
            data: {
              content: payload.content,
              headImg: payload.headImg,
              sendTime: payload.sendTime,
              nickname: payload.nickname,
              toUser: payload.fromUser,
              haveRead: haveRead,
              online: 1
            }
          });
        }
      }
    }
  }
}
export default new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  state,
  mutations,
  actions
})