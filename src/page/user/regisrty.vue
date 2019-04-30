<template>
  <div>
    <div class="logo">注册</div>
    <div class="inputBox">
      <label>用户名</label>
      <div class="info">
        <input type="text" placeholder="请输入用户名" v-model="username">
      </div>
    </div>
    <div class="inputBox">
      <label>昵称</label>
      <div class="info">
        <input type="text" placeholder="请输入昵称" v-model="nickname">
      </div>
    </div>
    <div class="inputBox">
      <label>密码</label>
      <div class="info">
        <input type="password" placeholder="请输入密码" v-model="password">
      </div>
    </div>
    <div class="inputBox">
      <label>确认密码</label>
      <div class="info">
        <input type="password" placeholder="请再次输入密码" v-model="confirmPassword">
      </div>
    </div>
    <div class="but">
      <button @click="submit">注册</button>
    </div>
    <div class="regisrty">
      <router-link to="/login">有账号？去登录</router-link>
    </div>
  </div>
</template>
<script>
import md5 from "md5";
export default {
  name: "regisrty",
  components: {},
  data() {
    return {
      username: "",
      nickname: "",
      password: "",
      confirmPassword: ""
    };
  },
  methods: {
    submit() {
      if (!this.username) {
        this.prompt("请输入用户名");
        return;
      }
      if (!this.nickname) {
        this.prompt("请输入昵称");
        return;
      }
      if (!this.password) {
        this.prompt("请输入密码");
        return;
      }
      if (!this.confirmPassword) {
        this.prompt("请确认密码");
        return;
      }
      if (this.confirmPassword !== this.password) {
        this.prompt("两次密码不一致");
        return;
      }
      this.$ajax
        .post("user/register", {
          username: this.username,
          nickname: this.nickname,
          password: md5(this.password)
        })
        .then(res => {
          console.log(res);
          this.prompt("注册成功！");
          this.$router.push("/login");
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
