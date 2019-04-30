// vue.config.js
module.exports = {
  // 文件访问地址
  publicPath: process.env.NODE_ENV === 'production' ?
    '/dist/' : '/',
  // 生产环境构建文件的目录(默认为：dist)
  outputDir: "dist",
  // 放置生成的静态资源 (js、css、img、fonts) 的 (相对于 outputDir 的) 目录
  assetsDir: "",
  // 指定生成的 index.html名称
  indexPath: "index.html",
  // 是否使用包含运行时编译器的Vue核心的构建
  runtimeCompiler: true,
  // eslint-loader 是否在保存的时候检查
  lintOnSave: process.env.NODE_ENV !== 'production',
  //css配置
  css: {
    // 是否开启支持 foo.module.css 样式
    modules: false,
    // 是否使用 css 分离插件 ExtractTextPlugin，采用独立样式文件载入，不采用 <style> 方式内联至 html 文件中
    extract: false,
    // 是否构建样式地图，false 将提高构建速度
    sourceMap: false,
    loaderOptions: {
      // 给 sass-loader 传递选项
      sass: {
        // @/ 是 src/ 的别名
        // 所以这里假设你有 `src/variables.scss` 这个文件
        data: `@import "@/style/mixin.scss";`
      }
    }
  },
  //服务器配置
  devServer: {
    //域名
    host: '0.0.0.0',
    //是否https
    https: false,
    //服务器端口号
    port: 8000,

    hotOnly: false,
    //配置自动启动浏览器
    open: true,
    //配置服务器代理
    proxy: {
      '/api': {
        target: 'http://192.168.1.149',
        // 代理WebSockets
        ws: true,
        // 虚拟主机站点需要
        changeOrigin: true
      },
    }
  },
  // 构建时开启多进程处理 babel 编译
  parallel: require('os').cpus().length > 1
}