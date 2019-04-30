import store from '@/config/store';
import router from '@/router/index';
import { baseUrl } from '@/config/constPool';
import { prompt, $alert } from '@/utils/utils';
//引入请求方法
import request from "@/utils/request";
//创建request对象
var http = new request({
  //定义请求地址公共部分(必填)
  baseUrl: baseUrl,
  //设置请求超时时间，单位：毫秒，低于2000毫秒是默认系统超时时间（默认为0 ）
  timeout: 0,
  //设置请求头（默认为{}）
  headers: {
    'Content-Type': 'application/json'
  }
});
//请求开始回调
http.requestStart = function (options) {
  //判断当前接口是否需要加载动画
  if (options.load) {
    //打开加载动画
    store.commit('setLoading', true);
  }
}
//请求结束
http.requestEnd = function (options, resolve) {
  console.log(resolve.responseURL, '\n', JSON.parse(resolve.response));
  //判断当前接口是否需要加载动画
  if (options.load) {
    store.commit('setLoading', false);
  }
}
//所有接口数据处理（这里是我们公司的java后台的数据结构，使用的小伙伴各自按照实际情况处理）
http.dataFactory = function (options, resolve) {
  //设置回调默认值
  var callback = {
    success: false,
    result: "未定义返回值"
  };
  //判断数据是否请求成功
  if (resolve.code == 200) {
    callback.success = true;
    callback.result = resolve.data;
  } else if (parseInt(resolve.code) == 1000) { //code == 1000 是用户未登录
    //这个是React Native的原生方法
    $alert("您还未登录，请先登录", {
      type: 1,
      confirmText: "去登录",
      cancelText: "再等等"
    }, res => {
      if (res.confirm) {
        router.push("/");
      }
    });
  } else { //其他错误提示
    if (options.isPrompt) {
      prompt(resolve.msg);
    }
    callback.result = resolve.msg;
  }
  //本回调函数必须有return，返回数据结构为：
  // {
  //    success: （true 返回到正确的位置 | false 返回到错误的位置）
  //    result:（返回数据）
  // }
  return callback;
}
//返回请求对象
export default http;