import * as qiniu from "qiniu-js";
import $ajax from "@/config/fetch";
export default function (files, wh, length) {
  //文件名称随机数
  var randomChar = function (l, url = "") {
    const x = "0123456789qwertyuioplkjhgfdsazxcvbnm";
    var tmp = "";
    var time = new Date();
    for (var i = 0; i < l; i++) {
      tmp += x.charAt(Math.ceil(Math.random() * 100000000) % x.length);
    }
    return (
      "file/upload/" +
      time.getFullYear() +
      time.getMonth() +
      "/" +
      time.getDate() +
      "/" +
      url +
      time.getTime() +
      tmp
    );
  };
  //获取token
  var getToken = function (callback) {
    $ajax("/apidoc/admin/qn_upload").then(data => {
      callback(data);
    });
  }

  function getWidthHeight(file, callback) {
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function (e) {
      let images = new Image();
      images.src = e.target.result;
      images.onload = function () {
        callback(images.width, images.height);
      }
    }

  }
  const _this = this;
  //文件数据体长度
  var len = length == 0 || files.length < length ? files.length : length;
  //图片地址
  var imgs = new Array;
  //token
  var token = "";
  //上传文件夹
  var folderPath = "";
  //访问前缀
  var visitPrefix = "";
  var config = {
    //表示是否使用 cdn 加速域名
    useCdnDomain: true,
    //qiniu.region.z0: 代表华东区域
    // qiniu.region.z1: 代表华北区域
    // qiniu.region.z2: 代表华南区域
    // qiniu.region.na0: 代表北美区域
    // qiniu.region.as0: 代表东南亚区域
    region: qiniu.region.z2
    //是否禁用日志报告
    // disableStatisticsReport: false
  };
  var putExtra = {
    //文件原文件名
    fname: "",
    // 用来放置自定义变量
    params: {},
    // 用来限制上传文件类型 ,限制类型放到数组里： ["image/png", "image/jpeg", "image/gif"]
    mimeType: [] || null
  };
  return new Promise((resolve, reject) => {
    getToken(red => {
      token = red.token;
      folderPath = red.folderPath;
      visitPrefix = red.visitPrefix;
      recursive(0);
    });

    //递归上传图片
    function recursive(i) {
      //上传状态
      var uploadState = true;
      var imgData = {};
      //文件上传配置
      var observable = qiniu.upload(
        files[i],
        randomChar(8),
        token,
        putExtra,
        config
      );
      if (wh) {
        uploadState = false;
        getWidthHeight(files[i], (width, height) => {
          imgData.width = width;
          imgData.height = height;
          if (uploadState) {
            imgs.push(imgData);
            //图片上传完成
            if (i < len - 1) {
              recursive(i + 1);
            } else {
              resolve(imgs, true);
            }
          } else {
            uploadState = true;
          }
        });
      }
      //文件开始上传
      var subscription = observable.subscribe(
        res => {
          //图片上传进度
          console.log("图片上传进度", res.total.percent);
        },
        err => {
          //图片报错
          console.log(err);
          reject(err);
        },
        res => {
          if (wh) {
            imgData.url = visitPrefix + "/" + res.key;
            if (uploadState) {
              imgs.push(imgData);
              //图片上传完成
              if (i < len - 1) {
                recursive(i + 1);
              } else {
                resolve(imgs, true);
              }
            } else {
              uploadState = true;
            }
          } else {
            imgs.push(visitPrefix + "/" + res.key);
            //图片上传完成
            if (i < len - 1) {
              recursive(i + 1);
            } else {
              resolve(imgs, true);
            }
          }
        }
      );
    }
  });
}

// 上传取消
// subscription.unsubscribe();
