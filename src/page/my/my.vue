<template>
  <div>
    <router-link class="myUserInfo" tag="div" to="/userInfo">
      <div class="userInfoBox">
        <div class="userImg">
          <img v-img v-if="userInfo.headImg" :src="imgBaseUrl+userInfo.headImg">
        </div>
        <div class="userInfo">
          <div class="name">{{userInfo.nickname}}</div>
          <p>用户名：{{userInfo.username}}</p>
        </div>
      </div>
      <i class="iconfont iconarrow-right"></i>
    </router-link>
  </div>
</template>
<script>
import { mapState, mapMutations } from "vuex";
import { imgBaseUrl } from "./../../config/constPool";
export default {
  name: "index1",
  components: {},
  data() {
    return {
      imgBaseUrl: imgBaseUrl
    };
  },
  computed: {
    ...mapState(["userInfo"])
  },
  methods: {},
  created() {}
};
</script>
<style lang="scss" scoped>
.myUserInfo {
  background-color: #fff;
  padding: rem(30);
  display: flex;
  justify-content: space-between;
  align-items: center;
  .userInfoBox {
    display: flex;
    .userImg {
      @include ic(rem(120), rem(120));
      border-radius: 50%;
      flex-shrink: 0;
      margin-right: rem(30);
    }
    .userInfo {
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      .name {
        font-size: rem(36);
      }
      p {
        color: #999;
      }
    }
  }
  .iconfont {
    color: #333;
  }
}
</style>
