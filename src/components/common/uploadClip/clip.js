class Clip {
  // 构造方法，实例化的时候将会被调用，如果不指定，那么会有一个不带参数的默认构造函数.
  constructor(_this, wpId) {
    if (this.getImage) {
      this.wpId.removeChild(this.getImage);
    }
    if (this.editBox) {
      this.wpId.removeChild(this.editBox);
    }
    this.getImage = document.createElement('canvas');
    this.getImage.id = 'image-box';
    this.editBox = document.createElement('div');
    this.editBox.id = 'cover-box';
    wpId.appendChild(this.getImage);
    wpId.appendChild(this.editBox);
    this._this = _this;
    this.wpId = wpId;
    //剪裁框比例
    this.proportion = _this.proportion;
  }
  //初始数据
  init(file) {
    //画布高宽
    this.boxWidth = this.wpId.offsetWidth;
    this.boxHeight = this.wpId.offsetHeight;
    //图片的初始倍数
    this.size = 1;
    this.sx = 0; //裁剪框的初始宽
    this.sy = 0; //裁剪框的初始高
    //图片初始移动位置
    this.deviationX = 0;
    this.deviationY = 0;
    this.cxt = this.getImage.getContext('2d');
    this.handleFiles(file);
    //图片旋转状态
    this.orientation = 1;
  }
  //第一步把图片对象转换为base64
  handleFiles(file) {
    let t = this;
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
      t.imgUrl = this.result;
      //检查如果是苹果手机上传图片先转换一下
      t.getOrientation(file, function (orientation) {
        if (orientation == 6) {
          let rotateCanvas = document.createElement('canvas');
          let rot = rotateCanvas.getContext('2d');
          let images = new Image();
          images.src = t.imgUrl;
          images.onload = function () {
            rotateCanvas.width = images.height;
            rotateCanvas.height = images.width;
            rot.drawImage(images, -rotateCanvas.height / 2, -rotateCanvas.width / 2, images.height, images.width);
            rot.save();//保存状态
            rot.translate(images.height / 2, images.width / 2);//设置画布上的(0,0)位置，也就是旋转的中心点
            rot.rotate(90 * Math.PI / 180);
            rot.drawImage(images, -rotateCanvas.height / 2, -rotateCanvas.width / 2);
            rot.restore();
            t.imgUrl = rotateCanvas.toDataURL('image/jpeg', 1);
            t.paintImg(function (imgScale) {
              t.cutImage(imgScale);
              t.drag();
            });
          }
        } else {
          t.paintImg(function (imgScale) {
            t.cutImage(imgScale);
            t.drag();
          });
        }
      });
    }

  }
  //第二步把图片显示到画布上
  paintImg(callback) {
    let t = this;
    let img = new Image();
    img.src = t.imgUrl;
    img.onload = function () {
      t.img = img;
      //先清空画布
      t.cxt.clearRect(0, 0, t.getImage.width, t.getImage.height);
      let imgScale = img.width / img.height;
      let boxScale = t.boxWidth / t.boxHeight;

      //判断盒子与图片的比列
      if (imgScale < boxScale) {
        //设置图片的像素
        if (t.boxWidth < t.boxHeight) {
          t.imgWidth = t.boxWidth * 0.8;
          t.imgHeight = t.imgWidth / imgScale;
        } else {
          t.imgWidth = t.boxHeight * 0.8;
          t.imgHeight = t.imgWidth / imgScale;
        }
        t.deviationX = (t.boxWidth - t.imgWidth * t.size) / 2;
        t.deviationY = (t.boxHeight - t.imgHeight * t.size) / 2;
      } else {
        //设置图片的像素
        if (t.boxWidth < t.boxHeight) {
          t.imgHeight = t.boxWidth * 0.8;
          t.imgWidth = t.imgHeight * imgScale;
        } else {
          t.imgHeight = t.boxHeight * 0.8;
          t.imgWidth = t.imgHeight * imgScale;
        }
        t.deviationX = (t.boxWidth - t.imgWidth * t.size) / 2;
        t.deviationY = (t.boxHeight - t.imgHeight * t.size) / 2;
      }
      //高分屏下图片模糊，需要2倍处理
      t.getImage.height = t.boxHeight;
      t.getImage.width = t.boxWidth;

      t.cxt.drawImage(img, t.deviationX, t.deviationY, t.imgWidth * t.size, t.imgHeight * t.size)
      if (callback) {
        callback(imgScale);
      }
    }
  }
  //第三步调整遮罩层高宽：
  cutImage(imgScale) {
    let t = this;
    //判断图片与选择框的比例大小，作出裁剪
    if (t.boxHeight > t.boxWidth) {
      //设置选择框的像素
      t.sWidth = t.boxWidth * 0.8;
      t.sHeight = (t.boxWidth / t.proportion) * 0.8;
    } else {
      //设置选择框的像素
      t.sWidth = (t.boxHeight * t.proportion) * 0.8;
      t.sHeight = t.boxHeight * 0.8;
    }
    //绘制遮罩层：
    t.editBox.style.width = t.sWidth + 'px';
    t.editBox.style.height = t.sHeight + 'px';
  }
  //第四步鼠标拖动选取
  drag() {
    let t = this;
    let draging = false;
    //记录初始点击的pageX，pageY。用于记录位移
    let pageX = 0;
    let pageY = 0;

    //记录首次的位置
    let startX = 0;
    let startY = 0;

    //获取图片X移动的最大距离
    t.imgLeftMax = (t.boxWidth - t.sWidth) / 2;
    //获取图片Y移动的最大距离
    t.imgTopMax = (t.boxHeight - t.sHeight) / 2;
    //获取图片X移动的最小距离
    t.imgLeftMin = (t.imgLeftMax + t.sWidth) - (t.imgWidth * t.size);
    //获取图片Y移动的最小距离
    t.imgTopMin = (t.imgTopMax + t.sHeight) - (t.imgHeight * t.size);
    t.wpId.addEventListener('touchstart', function (ev) {
      let e = ev.touches[0];
      draging = true;
      //
      pageX = e.pageX;
      pageY = e.pageY;
      //记录首次的位置
      startX = t.deviationX;
      startY = t.deviationY;

    })
    t.wpId.addEventListener('touchmove', function (ev) {
      let e = ev.touches[0];
      let offsetX = e.pageX - pageX;
      let offsetY = e.pageY - pageY;
      if (draging) {
        t.cxt.clearRect(0, 0, t.getImage.width, t.getImage.height);
        t.deviationX = offsetX + startX;
        t.deviationY = offsetY + startY;

        // 大于最大移动距离
        // if (t.deviationX > t.imgLeftMax) {
        //   t.deviationX = t.imgLeftMax;
        // } else if (t.deviationX < t.imgLeftMin) {
        //   t.deviationX = t.imgLeftMin;
        // }
        // if (t.deviationY > t.imgTopMax) {
        //   t.deviationY = t.imgTopMax;
        // } else if (t.deviationY < t.imgTopMin) {
        //   t.deviationY = t.imgTopMin;
        // }
        t.cxt.drawImage(t.img, t.deviationX, t.deviationY, t.imgWidth * t.size, t.imgHeight * t.size)
      }
    });
    t.wpId.addEventListener('touchend', function () {
      draging = false;
    })
  }
  //第五步放大缩小功能
  //放大
  enlarge() {
    const t = this;
    const sizeMax = this.size * 2;
    if (sizeMax > 5) {
      this.size = 5;
    } else {
      this.size = sizeMax;
      this.paintImg(function (imgScale) {
        t.drag();
      });
    }
  }
  //缩小
  narrow() {
    const t = this;
    const sizeMax = this.size / 2;
    if (sizeMax < 0.1) {
      this.size = 0.1;
    } else {
      this.size = sizeMax;
      this.paintImg(function (imgScale) {
        t.drag();
      });
    }
  }
  //第六步 截取生成图片
  saves(callback) {
    let t = this;
    let saveCanvas = document.createElement('canvas');
    let ctx = saveCanvas.getContext('2d');
    //图片裁剪后的尺寸
    saveCanvas.width = t.sWidth;
    saveCanvas.height = t.sHeight;
    let images = new Image();
    images.src = t.imgUrl;

    images.onload = function () {
      //计算偏移的距离
      const imagesX = t.deviationX - t.imgLeftMax;
      const imagesY = t.deviationY - t.imgTopMax;

      const vertSquashRatio = t.detectVerticalSquash(images);
      ctx.drawImage(images, imagesX, imagesY, t.imgWidth * t.size, t.imgHeight * t.size);
      const clipUrl = saveCanvas.toDataURL('image/jpeg', 1);
      if (callback) {
        callback(clipUrl);
      }
      t.wpId.removeChild(t.getImage);
      t.wpId.removeChild(t.editBox);
    }
  }
  //用于修复ios下的canvas截图问题
  //详情可以看这里http://stackoverflow.com/questions/11929099/html5-canvas-drawimage-ratio-bug-ios
  detectVerticalSquash(img) {
    if (/png$/i.test(img.src)) {
      return 1;
    }
    let iw = img.naturalWidth, ih = img.naturalHeight;
    let canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = ih;
    let ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);
    let data = ctx.getImageData(0, 0, 1, ih).data;

    let sy = 0;
    let ey = ih;
    let py = ih;
    while (py > sy) {
      const alpha = data[(py - 1) * 4 + 3];
      if (alpha === 0) {
        ey = py;
      } else {
        sy = py;
      }
      py = (ey + sy) >> 1;
    }
    const ratio = (py / ih);
    return (ratio === 0) ? 1 : ratio;
  }
  //检测图像是否是横向的（苹果手机）
  getOrientation(file, callback) {
    var reader = new FileReader();
    reader.onload = function (e) {
      var view = new DataView(e.target.result);
      if (view.getUint16(0, false) != 0xFFD8) return callback(-2);
      var length = view.byteLength, offset = 2;
      while (offset < length) {
        var marker = view.getUint16(offset, false);
        offset += 2;
        if (marker == 0xFFE1) {
          if (view.getUint32(offset += 2, false) != 0x45786966) return callback(-1);
          var little = view.getUint16(offset += 6, false) == 0x4949;
          offset += view.getUint32(offset + 4, little);
          var tags = view.getUint16(offset, little);
          offset += 2;
          for (var i = 0; i < tags; i++)
            if (view.getUint16(offset + (i * 12), little) == 0x0112)
              return callback(view.getUint16(offset + (i * 12) + 8, little));
        }
        else if ((marker & 0xFF00) != 0xFF00) break;
        else offset += view.getUint16(offset, false);
      }
      return callback(-1);
    };
    reader.readAsArrayBuffer(file.slice(0, 64 * 1024));
  }

}
export default Clip;
