/****************生产环境****************/
//请求接口
let baseUrl = '';
//图片路径
let imgBaseUrl = '';
//路由模式
let routerMode = 'hash';

/****************开发环境****************/
if (process.env.NODE_ENV === 'development') {
  //请求接口
  baseUrl = 'http://192.168.1.149:3001/';
  //图片路径
  imgBaseUrl = 'http://192.168.1.149:3001/';
  //路由模式
  routerMode = 'history';
}

/****************常量配置****************/
//手机号验证正则表达式
const phoneRegular = /^1\d{10}$/;
//邮箱验证正则表达式
const mailRegular = /^\w+@\w+(\.[a-zA-Z]{2,3}){1,2}$/;
//密码验证正则表达式
const passwordRegular = /^[a-zA-Z0-9]{4,10}$/;

export {
  baseUrl,
  imgBaseUrl,
  routerMode,
  phoneRegular,
  mailRegular,
  passwordRegular
};