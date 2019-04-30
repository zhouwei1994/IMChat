<template>
  <div class="chatPage">
    <z-Header>{{$route.query.name || "聊天"}}</z-Header>
    <div
      class="chatRoomBox"
      ref="chatRoomBox"
      :class="{'control':controlState == 1201 || controlState == 1301}"
      @click="controlState = 1101"
    >
      <div class="chatRoomListBox" ref="chatRoom">
        <div class="seeMore" v-if="total > pageNo" @click="pageNo=pageNo+1;getChatHistoryInfo(10)">
          查看更多
          <i class="iconfont icon-shang"></i>
        </div>
        <div class="chatRoomlist" v-for="(item,index) of chatInfoList" :key="index">
          <div class="time">{{item.sendTime}}</div>
          <div class="chatInfo" :class="[userInfo.id == item.fromUser ? 'chatRight' :'chatLeft' ]">
            <div class="chatuserImg">
              <img v-img v-if="item.headImg" :src="imgBaseUrl+item.headImg">
            </div>
            <div class="chatContentBox">
              <div class="userName">{{item.nickname}}</div>
              <div class="chatContent" v-if="item.type == 'message'">
                <div v-html="item.content"></div>
                <div
                  class="haveRead"
                  v-if="userInfo.id == item.fromUser"
                >{{item.haveRead == 0 ? "已读":"未读"}}</div>
              </div>
              <div class="chatImages" v-else-if="item.type == 'image'">
                <div class="img" @click="onImgPreview(index)">
                  <img v-img.fit :src="imgBaseUrl+item.content">
                </div>
                <div
                  class="haveRead"
                  v-if="userInfo.id == item.fromUser"
                >{{item.haveRead == 0? "已读":"未读"}}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="chatSendBox" :class="{'control':controlState == 1101}">
      <div class="chatMessage" @click="controlState = 1101">
        <div ref="chatMessage" contenteditable="true" @keyup="messageKeyup" @focus="messageFocus"></div>
      </div>
      <div class="emoji" @click="controlState = 1201;chatScroll();">
        <svg viewBox="0 0 1024 1024">
          <path
            d="M969.6235 463.0988C942.7696 210.6305 716.1104 27.857 463.3704 54.8571 210.6305 81.8573 27.5017 308.4121 54.3765 560.9012c26.8539 252.4682 253.5131 435.2418 506.274 408.2416C813.3695 942.1427 996.4983 715.567 969.6235 463.0988zM647.8158 323.8557c40.3958 0 73.1429 32.7471 73.1429 73.1429 0 40.3958-32.7471 73.1429-73.1429 73.1429s-73.1429-32.7471-73.1429-73.1429C574.673 356.6028 607.4201 323.8557 647.8158 323.8557zM376.1424 323.8557c40.3958 0 73.1429 32.7471 73.1429 73.1429 0 40.3958-32.7471 73.1429-73.1429 73.1429s-73.1429-32.7471-73.1429-73.1429C302.9995 356.6028 335.7466 323.8557 376.1424 323.8557zM737.4681 636.6981c-22.319 99.1608-123.1935 167.7897-225.489 167.7897-105.9944 0-206.3673-70.4888-226.4085-171.7812 0-27.3763 20.898-37.1984 33.7711-37.1984 84.6785 0 290.6488 0 380.0921 0C708.7961 595.5291 744.5943 598.7683 737.4681 636.6981z"
            p-id="2325"
          ></path>
        </svg>
      </div>
      <button class="send" v-if="sendState" @click="onSend">发送</button>
      <div class="more" v-else @click="controlState = 1301;chatScroll();">
        <svg viewBox="0 0 1024 1024">
          <path
            d="M486.4 0h48.16C791.52 7.2 1016.48 231.36 1024 488.48v39.2C1021.44 787.52 794.4 1016.64 535.04 1024h-47.68C231.84 1015.84 8.8 793.12 0 537.6v-45.12C5.12 234.88 229.44 8.96 486.4 0M464 224v240H224v96h240v240h96V560h240v-96H560V224h-96z"
          ></path>
        </svg>
      </div>
    </div>
    <div class="emojiSelctBox" v-if="controlState == 1201">
      <swiper class="emojiSwiper" :options="emojiSwiper">
        <swiper-slide v-for="(item,index) of emojiList" :key="index">
          <div v-html="item.node.outerHTML" @click="addEmoji(item)"></div>
        </swiper-slide>
      </swiper>
      <div class="swiper-pagination"></div>
    </div>
    <div class="moreBox" v-if="controlState == 1301">
      <div class="albumBox" @click="uploadImage">
        <div>
          <svg viewBox="0 0 1024 1024">
            <path
              d="M765.376 256.30400000000003s103.03893333333333-1.024 103.03893333333333 100.99306666666666c0 0 9.536 98.752-103.03893333333333 100.928 0 0-100.864 2.1770666666666667-99.83999999999999-100.928 0-0.064-1.088-91.45599999999999 99.83999999999999-100.99306666666666zM968.3210666666666 101.16800000000006s54.208 4.222933333333334 54.208 52.032000000000004v712.8330666666666s-3.2010666666666663 51.008-54.208 52.09706666666667v-816.9599999999999z"
            ></path>
            <path
              d="M1.47199999999998 866.096s2.1770666666666667 52.09706666666667 52.09706666666667 52.09706666666667h914.7520000000001v-150.84799999999998h-99.71093333333333l-203.072-206.14399999999998-153.024 153.98506666666665-208.192-257.024-205.056 307.07093333333336-45.632 1.024-1.1509333333333334-612.9930666666667h-51.008v712.8330666666666zM968.3210666666666 101.16800000000006H53.569066666666686s-52.09493333333333-1.088-52.09493333333333 52.032000000000004h966.848v-52.032000000000004z"
            ></path>
          </svg>
        </div>
        <p>图片</p>
      </div>
    </div>
    <img-preview v-model="imgPreview" :data="previewData"></img-preview>
  </div>
</template>
<script>
import { swiper, swiperSlide } from "vue-awesome-swiper";
import { mapState, mapMutations, mapActions } from "vuex";
import openSocket, { sendText, socket } from "./../../utils/socket";
import { formatTime } from "./../../utils/utils";
import { imgBaseUrl } from "./../../config/constPool";
import imgPreview from "@/components/common/imgPreview";

export default {
  components: {
    swiper,
    swiperSlide,
    imgPreview
  },
  computed: {},
  data() {
    return {
      message: "",
      chatInfoList: [],
      imgBaseUrl: imgBaseUrl,
      emojiSwiper: {
        slidesPerView: 7,
        slidesPerColumn: 4,
        slidesPerGroup: 7,
        spaceBetween: 0,
        loopFillGroupWithBlank: true,
        //设置分页
        pagination: ".swiper-pagination",
        //设置分页点击
        paginationClickable: true
      },
      //图片预览
      imgPreview: false,
      //预览图片列表
      previewData: {
        list: [],
        index: 0
      },
      //表情列表
      emojiList: [],
      //操作控制状态
      controlState: 1101,
      sendState: false,
      //查看更多状态
      moreState: false,
      //历史滚动高度
      historyScrollTop: 0,
      pageNo: 1,
      pageSize: 3,
      total: 1
    };
  },
  computed: {
    ...mapState(["userInfo"])
  },
  watch: {},
  created() {
    if (this.userInfo.id) {
      openSocket(this.userInfo);
      this.getChatHistoryInfo();
    } else {
      this.$router.push("/login");
    }
    global.chatMessage = res => {
      console.log("chat页面", res);
      if (res.fromUser == this.$route.params.toUser) {
        if (res.type == "haveRead") {
          this.chatInfoList.map(item => {
            if (item.haveRead == 0) {
              item.haveRead = 1;
            }
            return item;
          });
        } else {
          this.chatInfoList.push(res);
          this.chatScroll();
          sendText({
            toUser: this.$route.params.toUser,
            type: "haveRead"
          });
        }
      }
    };
  },
  methods: {
    ...mapActions(["chatUserInfo"]),
    //表情添加输入框
    addEmoji(item) {
      var cssText = item.node.style.cssText;
      var chatMessage = this.$refs.chatMessage;
      var input = document.createElement("input");
      input.style = cssText;
      input.type = "button";
      input.setAttribute("symbol", item.symbol);
      chatMessage.appendChild(input);
      this.sendState = true;
    },
    //数据变化时判断发送按钮状态
    messageKeyup(e) {
      var html = e.target.innerHTML;
      if (html !== "<br>" && e.target.innerHTML.length > 0) {
        this.sendState = true;
      } else {
        this.sendState = false;
      }
    },
    //输入框获取焦点
    messageFocus(event) {
      var thisTarget = event.target || event.srcElement;
      setTimeout(function() {
        thisTarget.scrollIntoView(true);
      }, 500);
    },
    //发送消息
    onSend() {
      var chatMessageText = this.$refs.chatMessage.innerHTML;
      if (chatMessageText == "") {
        return;
      }
      var chatMessage = chatMessageText
        .replace(/<\/?.+?\"\[/g, "[")
        .replace(/\]\"(.*?)>/g, "]")
        .replace(/<\/?.+?>/g, "");
      //发送消息
      this.sendMsg(chatMessage, "message");
    },
    //上传图片
    uploadImage() {
      const _this = this;
      var msg = "";
      var input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*";
      input.style.display = "none";
      document.body.appendChild(input);
      input.click();
      input.onchange = function(e) {
        var files = e.target.files;
        var formData = new FormData();
        formData.append("file", files[0]);
        _this.$ajax.form("upload_file", formData).then(res => {
          document.body.removeChild(input);
          _this.sendMsg(res, "image");
        });
      };
    },
    //获取历史记录
    getChatHistoryInfo(pageSize) {
      if (pageSize) {
        this.pageSize = pageSize;
      }
      const _this = this;
      this.$nextTick(() => {
        // 点击之前记录滚动条位置;
        var chatRoomBox = this.$refs.chatRoomBox;
        var chatRoom = this.$refs.chatRoom;
        var scrollHeight = chatRoom.scrollHeight;
        this.historyScrollTop = scrollHeight - chatRoomBox.scrollTop;
      });
      this.$ajax
        .get("messageRecord", {
          userId: this.userInfo.id,
          toUser: this.$route.params.toUser,
          pageNo: this.pageNo,
          pageSize: this.pageSize
        })
        .then(res => {
          let liet = res.list.reverse();
          this.chatInfoList = liet.concat(this.chatInfoList);
          this.total = res.total / this.pageSize;
          this.$nextTick(() => {
            this.chatScroll("history");
          });
        });
    },
    //发送信息
    sendMsg(msg, type) {
      const _this = this;
      let config = {
        content: msg,
        toUser: this.$route.params.toUser,
        type: type
      };
      sendText(config);
      let chatConfig = {
        fromUser: this.userInfo.id,
        haveRead: 1,
        headImg: this.userInfo.headImg,
        nickname: this.userInfo.nickname,
        sendTime: formatTime("", "yyyy-MM-dd hh:mm:ss"),
        ...config
      };
      this.chatInfoList.push(chatConfig);
      this.chatUserInfo(chatConfig);
      let chatMessage = this.$refs.chatMessage;
      chatMessage.innerHTML = "";
      _this.controlState = 1101;
      _this.sendState = false;
      this.chatScroll();
    },
    // 图片预览
    onImgPreview(imgIndex) {
      let previewList = new Array();
      let previewIndex = 0;
      this.chatInfoList.forEach((item, index) => {
        if (item.type == "image") {
          previewList.push(item.content);
          if (index == imgIndex) {
            previewIndex = previewList.length - 1;
          }
        }
      });
      this.previewData = {
        list: previewList,
        index: previewIndex
      };
      this.imgPreview = true;
    },
    //数据滚动到最底部
    chatScroll(type = "bottom") {
      var chatRoomBox = this.$refs.chatRoomBox;
      var chatRoom = this.$refs.chatRoom;
      setTimeout(() => {
        var scrollHeight = chatRoom.scrollHeight;
        if (scrollHeight > 0) {
          if (type == "bottom") {
            var scrollTop = chatRoomBox.scrollTop || chatRoomBox.scrollTop;
            var scrollTopHeight = scrollHeight - chatRoomBox.offsetHeight;
            if (scrollTop < scrollTopHeight) {
              chatRoomBox.scrollTop = scrollTopHeight;
            }
          } else {
            chatRoomBox.scrollTop = scrollHeight - this.historyScrollTop;
          }
        }
      }, 10);
    }
  },
  mounted() {
    // const _this = this;
  }
};
</script>
<style lang="scss">
@import "src/style/mixin";
.chatRoomBox {
  height: calc(100vh - 5.6rem);
  overflow-y: auto;
  &.control {
    height: calc(100vh - 15.4rem);
  }
  .chatRoomListBox {
    padding: rem(30);
    .seeMore {
      padding-bottom: rem(30);
      text-align: center;
      font-size: rem(26);
      color: #999;
      // &::before {
      //   content: "————";
      //   margin-right: rem(15);
      //   color: #ccc;
      // }
      // &::after {
      //   content: "————";
      //   margin-left: rem(15);
      //   color: #ccc;
      // }
      i {
        margin-left: rem(10);
        font-size: rem(26);
        color: #999;
      }
    }
    .chatRoomlist {
      .chatInfo {
        display: flex;
        > .chatuserImg {
          width: rem(80);
          height: rem(80);
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          flex-shrink: 0;
          background-color: #fff;
        }
        //文字内容、商品信息内容
        .chatContentBox {
          max-width: calc(100% - 3.08rem);
          > .userName {
            font-size: rem(22);
            text-align: right;
            margin-bottom: rem(10);
          }
          > .chatContent {
            padding: rem(22) rem(30);
            font-size: rem(30);
            border-radius: rem(8);
            position: relative;
            word-wrap: break-word;

            &::after {
              content: "";
              position: absolute;
              top: rem(30);
              width: 0;
              height: 0;
              border-bottom: rem(10) solid transparent;
              border-top: rem(10) solid transparent;
            }
            //商品信息内容
            &.service {
              max-width: calc(100% - 3.08rem);
              .serviceHead {
                font-size: rem(26);
                color: #171717;
                padding-bottom: rem(15);
              }
              .serviceContent {
                display: flex;
                .contentImg {
                  width: rem(127);
                  height: rem(127);
                  overflow: hidden;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  flex-shrink: 0;
                  background-color: #fff;
                  margin-right: rem(30);
                  > img {
                  }
                }
                > .serviceInfo {
                  display: flex;
                  flex-direction: column;
                  justify-content: space-between;
                  width: calc(100% - 4.396rem);
                  > .title {
                    font-size: rem(30);
                    color: #171717;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                  }
                  .other {
                    font-size: rem(26);
                    color: #bbb;
                  }
                  .price {
                    display: flex;
                    align-items: flex-end;
                    text: nth-child(1) {
                      font-size: rem(36);
                      color: #ea0303;
                    }
                    text:nth-child(2) {
                      font-size: rem(30);
                      color: #bbb;
                      text-decoration: line-through;
                      margin-left: rem(20);
                    }
                  }
                  .priceNum {
                    display: flex;
                    justify-content: space-between;
                    text:nth-child(1) {
                      font-size: rem(36);
                      color: #ea0303;
                    }
                    text:nth-child(2) {
                      font-size: rem(26);
                      color: #bbb;
                    }
                  }
                }
              }
            }
          }
          //图片
          > .chatImages {
            display: flex;
            position: relative;
            max-width: rem(400);
            max-height: rem(400);
            > div.img {
              max-width: rem(400);
              max-height: rem(400);
              border-radius: rem(10);
              display: flex;
              overflow: hidden;
              align-items: center;
              justify-content: center;
            }
          }
          //已读、未读
          .haveRead {
            position: absolute;
            left: rem(-80);
            top: 50%;
            transform: translateY(-50%);
            color: $mainColor !important;
          }
        }

        /* 左-对方 */
        &.chatLeft {
          padding-right: rem(70);
          > .chatuserImg {
            margin-right: rem(30);
          }
          > .chatContentBox {
            > .userName {
              text-align: left;
            }
            > .chatContent {
              background-color: #fff;
              color: #000;
              &::after {
                border-right: rem(18) solid #fff;
                left: rem(-15);
              }
            }
            > .chatImages {
              justify-content: flex-start;
            }
          }
        }
        /* 右-自己 */
        &.chatRight {
          padding-left: rem(70);
          flex-direction: row-reverse;
          > .chatuserImg {
            margin-left: rem(30);
          }
          > .chatContentBox {
            > .userName {
              text-align: right;
            }
            > .chatContent {
              background-color: #56b3f5;
              > div {
                color: #fff;
              }
              &::after {
                border-left: rem(18) solid #56b3f5;
                right: rem(-15);
              }
              &.service {
                background-color: #fff;
                &::after {
                  border-left: rem(18) solid #fff;
                }
              }
            }
            > .chatImages {
              justify-content: flex-end;
            }
          }
        }
      }
      //时间
      .time {
        display: flex;
        justify-content: center;
        align-items: center;
        height: rem(80);
        font-size: rem(24);
        color: #999;
      }
    }
  }
}
/* 发送 */
.chatSendBox {
  width: 100%;
  background-color: #fff;
  padding: 0 rem(30);
  display: flex;
  align-items: center;
  height: rem(100);
  box-shadow: 0 0 rem(10) rem(0) rgba(0, 0, 0, 0.1);
  &.control {
    position: fixed;
    bottom: 0;
    left: 0;
  }
  .chatMessage {
    flex: 1;
    max-height: rem(86);
    min-height: rem(73);
    background-color: #ffffff;
    margin-right: rem(30);
    border-bottom: 1px solid #eee;
    overflow: hidden;
    display: flex;
    align-items: center;
    > div {
      overflow-y: auto;
      max-height: rem(86);
      min-height: rem(48);
      width: 100%;
      outline: none;
      -webkit-user-select: text;
      input {
        border: 0px;
        outline: none;
        background-color: transparent;
        margin: 0 1px;
        display: inline-block;
      }
    }
  }
  .emoji {
    height: rem(53);
    width: rem(53);
    display: flex;
    margin-right: rem(20);
    svg {
      stroke: $mainColor;
      fill: $mainColor;
      height: rem(53);
      width: rem(53);
      flex-shrink: 0;
      margin-right: rem(10);
    }
  }
  .more {
    font-size: rem(55);
    color: $mainColor;
    height: rem(53);
    width: rem(53);
    display: flex;
    svg {
      stroke: $mainColor;
      fill: $mainColor;
      height: rem(53);
      width: rem(53);
      flex-shrink: 0;
      margin-right: rem(10);
    }
  }
  .send {
    color: #fff;
    background-color: $mainColor;
    height: rem(53);
    padding: 0 rem(15);
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: rem(10);
    font-size: rem(28);
  }
}
.emojiSelctBox {
  height: rem(450);
  position: relative;
  .emojiSwiper {
    width: 100%;
    height: rem(400);
    .swiper-slide {
      width: rem(100);
      height: rem(100);
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
  .swiper-pagination {
    width: 100%;
    bottom: rem(10);
    span {
      margin: 0 rem(10);
    }
    .swiper-pagination-bullet-active {
      background: $mainColor;
    }
  }
}
.moreBox {
  height: rem(450);
  padding: rem(25) rem(25);
  display: flex;
  flex-wrap: wrap;
  > div {
    width: 25%;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: rem(25);
    .swiper-pagination-bullet {
      width: 0;
      height: 0;
      display: none;
    }
    > div {
      width: rem(110);
      height: rem(110);
      border: 1px solid #ddd;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: rem(20);
      background-color: #fff;
      svg {
        stroke: #666;
        fill: #666;
        height: rem(63);
        width: rem(63);
        flex-shrink: 0;
      }
    }
    p {
      text-align: center;
      font-size: rem(26);
      margin-top: rem(15);
      color: #666;
    }
  }
}
</style>
