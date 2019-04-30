<template>
  <div>
    <z-Header back>
      消息
      <button class="searchFriend" slot="right" @click="searchFriend">搜索</button>
    </z-Header>
    <div class="interval"></div>
    <router-link
      class="chatList"
      v-for="(item,index) of chatList"
      :key="index"
      tag="div"
      :to="'/chat/'+item.toUser+'?name='+item.nickname"
    >
      <div class="chatUserInfo">
        <img v-img v-if="item.headImg" :src="imgBaseUrl+item.headImg">
      </div>
      <div class="chatInfo">
        <div class="nameTime">
          <span>{{item.nickname}} {{item.online ? '在线':'离线'}}</span>
          <span>{{item.sendTime}}</span>
        </div>
        <div class="chatMessage">
          <span>{{item.content}}</span>
          <span v-if="item.haveRead > 0">{{item.haveRead}}</span>
        </div>
      </div>
    </router-link>
  </div>
</template>
<script>
import { mapState, mapMutations } from "vuex";
import openSocket from "./../../utils/socket";
import { formatTime } from "./../../utils/utils";
import { imgBaseUrl } from "./../../config/constPool";
export default {
  data() {
    return {
      imgBaseUrl: imgBaseUrl
    };
  },
  computed: {
    ...mapState(["userInfo", "chatList"])
  },
  methods: {
    ...mapMutations(["setChatList"]),
    pageData() {
      let chatList = JSON.parse(JSON.stringify(this.chatList));
      let fromUsers = [];
      chatList.forEach(item => {
        fromUsers.push(item.toUser);
      });
      console.log(chatList);
      this.$ajax
        .post("unreadList", {
          fromUser: fromUsers,
          userId: this.userInfo.id
        })
        .then(data => {
          let startIndex = 0;
          data.forEach((item, index) => {
            let state = true;
            chatList.forEach((childItem, childIndex) => {
              if (childItem.toUser == item.fromUser) {
                state = false;
                startIndex = childIndex;
                chatList[childIndex].haveRead = item.haveRead;
                chatList[childIndex].online = item.online;
                chatList[childIndex].content =
                  item.content || childItem.content;
                chatList[childIndex].sendTime =
                  item.sendTime || childItem.sendTime;
                chatList[childIndex].type = item.type || childItem.type;
                chatList[childIndex].nickname = item.nickname;
                chatList[childIndex].headImg = item.headImg;
              }
            });
            if (state) {
              chatList.splice(startIndex, 0, {
                haveRead: item.haveRead,
                online: item.online,
                content: item.content,
                sendTime: item.sendTime,
                type: item.type,
                nickname: item.nickname,
                headImg: item.headImg,
                toUser: item.fromUser
              });
            }
          });
          this.setChatList({
            data: chatList
          });
        });
    },
    searchFriend() {
      this.$alert("请输入用户名", { type: 3 }, res => {
        if (res.confirm) {
          if (!res.value) {
            this.prompt("请输入用户名");
            return;
          }
          if (res.value == this.userInfo.username) {
            this.prompt("不可查询自己的用户名");
            return;
          }
          this.$ajax
            .get("searchFriend", {
              username: res.value
            })
            .then(data => {
              res.remove();
              this.setChatList({
                data: {
                  content: "",
                  headImg: data.headImg,
                  sendTime: formatTime("", "yyyy-MM-dd hh:mm:ss"),
                  nickname: data.nickname,
                  toUser: data.id,
                  online: data.online
                }
              });
              this.$router.push("/chat/" + data.id + "?name=" + data.nickname);
            });
        }
      });
    }
  },
  created() {
    if (this.userInfo.id) {
      openSocket(this.userInfo);
      this.pageData();
    } else {
      this.$router.push("/login");
    }
  },
  mounted() {}
};
</script>
<style lang="scss" scoped>
@import "src/style/mixin";
.searchFriend {
  height: rem(100);
  width: rem(100);
  background-color: transparent;
  font-size: rem(30);
  color: #f00;
}
.interval {
  height: rem(1);
}
.chatList {
  background-color: #fff;
  padding: rem(30);
  display: flex;
  border-bottom: 1px solid #f1f1f1;
  .chatUserInfo {
    width: rem(100);
    height: rem(100);
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    flex-shrink: 0;
    background-color: #fff;
    margin-right: rem(30);
  }
  .chatInfo {
    width: calc(100% - 3.64rem);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .nameTime {
      display: flex;
      justify-content: space-between;
      align-items: center;
      span {
        &:nth-child(1) {
          color: #313131;
          font-size: rem(30);
        }
        &:nth-child(2) {
          font-size: rem(24);
          color: #b4b4b4;
        }
      }
    }
    .chatMessage {
      display: flex;
      justify-content: space-between;
      align-items: center;
      span {
        &:nth-child(1) {
          color: #acacac;
          font-size: rem(24);
          width: calc(100% - 2rem);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        &:nth-child(2) {
          display: inline-block;
          background-color: #ea0303;
          border-radius: rem(13);
          height: rem(30);
          line-height: rem(30);
          padding: 0 rem(10);
          font-size: rem(20);
          color: #fff;
        }
      }
    }
  }
}
</style>
