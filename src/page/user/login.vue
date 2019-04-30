<template>
  <div>
    <div class="logo">聊天工具</div>
    <div class="inputBox">
      <label>用户名</label>
      <div class="info">
        <input type="text" placeholder="请输入用户名" v-model="username">
      </div>
    </div>
    <div class="inputBox">
      <label>密码</label>
      <div class="info">
        <input type="password" placeholder="请输入密码" v-model="password">
      </div>
    </div>
    <div class="but">
      <button @click="submit">登录</button>
    </div>
    <div class="regisrty">
      <router-link to="/regisrty">没账号？去注册</router-link>
    </div>
  </div>
</template>
<script>
import "./../../utils/socket";
import md5 from "md5";
import { mapMutations } from "vuex";
export default {
  name: "regisrty",
  components: {},
  data() {
    return {
      username: "",
      password: ""
    };
  },
  methods: {
    ...mapMutations(["setUserInfo"]),
    submit() {
      if (!this.username) {
        this.prompt("请输入用户名");
        return;
      }
      if (!this.password) {
        this.prompt("请输入密码");
        return;
      }
      this.$ajax
        .post("user/login", {
          username: this.username,
          password: md5(this.password)
        })
        .then(res => {
          console.log(res);
          this.prompt("登录成功！");
          this.setUserInfo(res);
          this.$router.push("/");
        });
    }
  },
  created() {}
};
</script>
<style lang="scss" scoped>
.logo {
  margin-top: rem(50);
  text-align: center;
  font-size: rem(40);
  margin-bottom: rem(40);
}
.inputBox {
  display: flex;
  background-color: #fff;
  padding: rem(20) rem(10);
  border-bottom: 1px solid #eee;
  label {
    height: rem(60);
    line-height: rem(60);
    min-width: rem(160);
    text-align: right;
    padding-right: rem(20);
    flex-shrink: 0;
  }
  .info {
    display: flex;
    width: 100%;
    input {
      width: 100%;
    }
  }
}
.but {
  margin-top: rem(60);
  padding: 0 rem(30);
  button {
    width: 100%;
    height: rem(80);
    border-radius: rem(8);
    color: #fff;
    background-color: $mainColor;
    font-size: rem(32);
  }
}
.regisrty {
  padding: 0 rem(30);
  margin-top: rem(10);
  color: $mainColor;
}
</style>
