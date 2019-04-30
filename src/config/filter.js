import $ajax from '@/config/ajax';
import {
  prompt,
  $alert,
  clickDateDiff,
  formatTime,
  loadMore,
  img
}
from '@/utils/utils';
export default {
  install(Vue) {
    /**
     * 加载更多
     */
    Vue.mixin(loadMore);
    /**
     * 图片居中剪切
     */
    Vue.mixin(img);
    /**
     * 时间戳转换为想要的时间格式
     */
    Vue.filter("format", function (value, format) {
      return formatTime(value, format);
    });
    /**
     * 时间转换为XX前
     */
    Vue.filter("getDateDiff", function (value) {
      return clickDateDiff(value);
    });
    /**
     * 金额保留两位
     */
    Vue.filter("decimal", function (value) {
      return parseFloat(value).toFixed(2);
    });
    /**
     * 消息提示
     */
    Vue.prototype.prompt = prompt;
    /**
     * 确认框 type = 1
     * 提示框 type = 2
     * 输入框 type = 3
     * 用法：
     * this.$alert("您还未登录，请登录", {}, res => {
     *    console.log(res); 
     *    //res.confirm 是否点击确认
     * });
     */
    Vue.prototype.$alert = $alert;

    /**
     * 数据请求
     * $http.post(url, data, {
     *    isPrompt: true, //（默认 true 说明：本接口抛出的错误是否提示）
     *    load: true, //（默认 true 说明：本接口是否提示加载动画）
     *    headers: { //默认 无 说明：请求头
     *      'Content-Type': 'application/json'
     *    },
     *    isFactory: true //（默认 true 说明：本接口是否调用公共的数据处理方法，设置false后isPrompt参数奖失去作用）
     * }).then(function (response) {
     *    //请求成功
     *    console.log(response);
     * }).catch(function (error) {
     *    //请求失败
     *    console.log(error);
     * });
     */
    Vue.prototype.$ajax = $ajax;
  }
}