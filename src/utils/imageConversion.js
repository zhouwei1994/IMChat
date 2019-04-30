//缩略图转换
function getThumbnail(file, config = {
  maxWidth: 200,
  maxHeight: 200,
}, callback) {
  getOrientation(file, orientation => {
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function (read) {
      let saveCanvas = document.createElement("canvas");
      let ctx = saveCanvas.getContext("2d");
      ctx.fillStyle = "rgba(255, 255, 255, 0)";
      let images = new Image();
      images.src = read.target.result;
      images.onload = function () {
        var width = images.width;
        var height = images.height;
        var ratio = width / height;
        var imgWidth = 0;
        var imgHeight = 0;
        if (width > height) {
          imgWidth = config.maxWidth;
          imgHeight = config.maxHeight / ratio;
        } else {
          imgWidth = config.maxWidth * ratio;
          imgHeight = config.maxHeight;
        }
        if (orientation == 6) {
          saveCanvas.width = imgHeight;
          saveCanvas.height = imgWidth;
          ctx.drawImage(images, 0, 0, imgHeight, imgWidth);
          ctx.save(); //保存状态
          ctx.translate(imgHeight / 2, imgHeight / 2);
          ctx.rotate((90 * Math.PI) / 180);
          ctx.translate(-imgHeight / 2, -imgHeight / 2);
          ctx.drawImage(images, 0, 0, imgWidth, imgHeight);
          ctx.restore();
        } else {
          saveCanvas.width = imgWidth;
          saveCanvas.height = imgHeight;
          ctx.drawImage(images, 0, 0, imgWidth, imgHeight);
        }
        const clipUrl = saveCanvas.toDataURL("image/png", 0.2);
        var index = clipUrl.indexOf(",");
        callback(clipUrl.substring(index + 1));
      };
      images.onerror = function (e) {
        console.log(e);
      };
    };
  });
}
//检测图像是否是横向的（苹果手机）
function getOrientation(file, callback) {
  var reader = new FileReader();
  reader.onload = function (e) {
    var view = new DataView(e.target.result);
    if (view.getUint16(0, false) != 0xffd8) return callback(-2);
    var length = view.byteLength,
      offset = 2;
    while (offset < length) {
      var marker = view.getUint16(offset, false);
      offset += 2;
      if (marker == 0xffe1) {
        if (view.getUint32((offset += 2), false) != 0x45786966)
          return callback(-1);
        var little = view.getUint16((offset += 6), false) == 0x4949;
        offset += view.getUint32(offset + 4, little);
        var tags = view.getUint16(offset, little);
        offset += 2;
        for (var i = 0; i < tags; i++)
          if (view.getUint16(offset + i * 12, little) == 0x0112)
            return callback(view.getUint16(offset + i * 12 + 8, little));
      } else if ((marker & 0xff00) != 0xff00) break;
      else offset += view.getUint16(offset, false);
    }
    return callback(-1);
  };
  reader.readAsArrayBuffer(file.slice(0, 64 * 1024));
}