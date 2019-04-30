<template>
  <div class="clipView" v-if="viewState">
    <header>
      <div class="header_view">
        <div class="backIcon" @click="close">
          <svg viewBox="0 0 1024 1024">
            <path
              d="M256 512.064c0 8.192 3.136 16.384 9.344 22.656l384 351.936a32 32 0 0 0 45.248-45.248L333.248 512.064l361.344-329.472a32 32 0 0 0-45.248-45.248l-384 352.064A32.128 32.128 0 0 0 256 512.064z"
            ></path>
          </svg>
        </div>
        <div class="title">上传图像</div>
        <div class="features" @click="saves">上传</div>
      </div>
    </header>
    <div class="clipBox" ref="clipBox">
      <div class="narrow">
        <span @click="enlarge">
          <svg viewBox="0 0 1024 1024">
            <path
              d="M768 448a320 320 0 1 0-320 320 320 320 0 0 0 320-320z m64 0A384 384 0 1 1 448 64a384 384 0 0 1 384 384z"
            ></path>
            <path
              d="M681.28 726.72a32 32 0 0 1 45.44-45.44l160 160a32 32 0 0 1-45.44 45.44zM320 480a32 32 0 0 1 0-64h256a32 32 0 0 1 0 64z"
            ></path>
            <path d="M480 576a32 32 0 0 1-64 0V320a32 32 0 0 1 64 0z"></path>
          </svg>
        </span>
        <span @click="narrow">
          <svg viewBox="0 0 1024 1024">
            <path
              d="M729.248 684.864l189.472 189.504a31.392 31.392 0 1 1-44.448 44.448L684.8 729.28a375.68 375.68 0 0 1-243.584 89.184C232.896 818.496 64 649.6 64 441.28 64 232.96 232.896 64 441.216 64c208.32 0 377.216 168.896 377.216 377.28 0 92.832-33.568 177.856-89.184 243.584z m-288.032 70.752c173.6 0 314.336-140.736 314.336-314.368s-140.736-314.368-314.336-314.368c-173.6 0-314.336 140.736-314.336 314.368s140.736 314.368 314.336 314.368zM252.608 441.28c0-17.344 10.56-31.424 23.584-31.424h330.048c13.024 0 23.584 14.08 23.584 31.424 0 17.376-10.56 31.456-23.584 31.456H276.192c-12.928-0.32-23.36-14.24-23.584-31.456z"
            ></path>
          </svg>
        </span>
      </div>
    </div>
  </div>
</template>
<script>
import clip from "./clip";
export default {
  components: {},
  props: {
    value: {
      default: ""
    }
  },
  watch: {
    value(val) {
      this.init(val);
    },
    viewState(val) {
      const _this = this;
      if (val) {
        setTimeout(() => {
          document.body.style.overflow = "hidden";
          _this.$refs.clipBox.addEventListener(
            "touchmove",
            function(evt) {
              evt.preventDefault();
            },
            false
          );
        }, 10);
      } else {
        document.body.style.overflow = "auto";
      }
    }
  },
  data() {
    return {
      viewState: false,
      //想要图片的比例
      proportion: 50 / 50,
      //挂载clip
      clip: {}
    };
  },
  methods: {
    enlarge() {
      this.clip.enlarge();
    },
    narrow() {
      this.clip.narrow();
    },
    saves() {
      const _this = this;
      this.clip.saves(function(data) {
        _this.viewState = false;
        _this.$emit("file", _this.dataURItoBlob(data));
      });
    },
    //转换为二进制数据图片
    dataURItoBlob(base64Data) {
      var byteString;
      if (base64Data.split(",")[0].indexOf("base64") >= 0) {
        byteString = atob(base64Data.split(",")[1]);
      } else {
        byteString = unescape(base64Data.split(",")[1]);
      }
      var mimeString = base64Data
        .split(",")[0]
        .split(":")[1]
        .split(";")[0];
      var ia = new Uint8Array(byteString.length);
      for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      return new Blob([ia], { type: mimeString });
    },
    //初始化打开
    init(data) {
      const _this = this;
      if (data) {
        _this.viewState = true;
        setTimeout(() => {
          _this.clip = new clip(_this, _this.$refs.clipBox);
          _this.clip.init(data);
        });
      } else {
        _this.viewState = false;
      }
    },
    // 关闭
    close() {
      this.viewState = false;
      this.$emit("close");
    }
  },
  mounted() {
    const _this = this;
    this.init(this.value);
  }
};
</script>
<style lang="scss">
@import "src/style/mixin";
.clipView {
  position: fixed;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  z-index: 100;
}

.clipBox {
  position: absolute;
  top: rem(88);
  left: 0px;
  width: 100%;
  bottom: 0px;
  background: #000;
  overflow: hidden;
}

#image-box {
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  background: #000;
}

#cover-box {
  position: absolute;
  top: 50%;
  left: 50%;
  cursor: move;
  outline: rgba(0, 0, 0, 0.5) solid 10000px;
  border: 1px solid #fff;
  transform: translateX(-50%) translateY(-50%);
}

.narrow {
  position: absolute;
  top: rem(20);
  right: rem(40);
  z-index: 10;
}

.narrow span {
  display: inline-block;
  width: rem(36);
  height: rem(36);
  background-position: center center;
  background-repeat: no-repeat;
  background-size: auto 100%;
  margin-left: rem(20);
}
.narrow svg {
  stroke: #fff;
  fill: #fff;
  height: rem(50);
  width: rem(50);
}
$headHeight: rem(100);
header {
  height: $headHeight;
  .header_view {
    position: fixed;
    height: $headHeight;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 2;
    background-color: #fff;
    display: flex;
    justify-content: space-between;
    .backIcon {
      height: $headHeight;
      width: $headHeight;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      svg {
        stroke: #333;
        fill: #333;
        height: rem(50);
        width: rem(50);
      }
    }
    .title {
      height: $headHeight;
      line-height: $headHeight;
      color: #333;
      font-size: rem(34);
    }
    .features {
      height: $headHeight;
      width: $headHeight;
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
}
</style>
