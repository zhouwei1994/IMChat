<template>
  <div>
    <z-Header>个人资料</z-Header>
    <div class="infoList" @click="onHeadImg">
      <label>头像</label>
      <div class="info">
        <div class="userImg">
          <img v-img v-if="headImg" :src="imgBaseUrl+headImg">
        </div>
        <i class="iconfont iconarrow-right"></i>
      </div>
    </div>
    <div class="infoList" @click="onNickname">
      <label>昵称</label>
      <div class="info">
        <div class="value">{{nickname}}</div>
        <i class="iconfont iconarrow-right"></i>
      </div>
    </div>
    <div class="but">
      <button @click="onSubmit">提交</button>
    </div>
    <upload-clip v-model="fileUrl" @file="imgFile"></upload-clip>
  </div>
</template>
<script>
import { mapState, mapMutations } from "vuex";
import { imgBaseUrl } from "./../../config/constPool";
import uploadClip from "@/components/common/uploadClip";
export default {
  name: "index1",
  components: {
    uploadClip
  },
  data() {
    return {
      imgBaseUrl: imgBaseUrl,
      headImg: "",
      nickname: "",
      fileUrl: ""
    };
  },
  computed: {
    ...mapState(["userInfo"])
  },
  methods: {
    ...mapMutations(["setUserInfo"]),
    onHeadImg() {
      const _this = this;
      var input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*";
      input.style.display = "none";
      document.body.appendChild(input);
      input.click();
      input.onchange = function(e) {
        var files = e.target.files;
        document.body.removeChild(input);
        _this.fileUrl = files[0];
      };
    },
    onNickname() {
      this.$alert("请输入昵称", { type: 3, inputValue: this.nickname }, res => {
        if (res.confirm) {
          if (res.value) {
            this.nickname = res.value;
            res.remove();
          } else {
            this.prompt("请输入昵称");
          }
        }
      });
    },
    imgFile(e) {
      var formData = new FormData();
      formData.append("file", e);
      this.$ajax.form("upload_file", formData).then(res => {
        this.headImg = res;
      });
    },
    onSubmit() {
      if (!this.headImg) {
        this.prompt("请上传头像");
        return;
      }
      if (!this.nickname) {
        this.prompt("请输入昵称");
        return;
      }
      this.$ajax
        .post("modify_user_info", {
          userId: this.userInfo.id,
          headImg: this.headImg,
          nickname: this.nickname
        })
        .then(res => {
          this.setUserInfo({
            headImg: this.headImg,
            nickname: this.nickname
          });
          this.prompt("修改成功！");
        });
    }
  },
  created() {
    this.headImg = this.userInfo.headImg;
    this.nickname = this.userInfo.nickname;
  }
};
</script>
<style lang="scss" scoped>
.infoList {
  margin-top: rem(15);
  padding: rem(30);
  background-color: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  &:active {
    background-color: #f5f5f5;
  }
  label {
    font-size: rem(30);
    color: #000;
    flex-shrink: 0;
  }
  .info {
    display: flex;
    align-items: center;
    .userImg {
      @include ic(rem(80), rem(80));
      border-radius: 50%;
      flex-shrink: 0;
    }
    .iconfont {
      margin-left: rem(30);
    }
  }
}
.but {
  padding: rem(30);
  display: flex;
  justify-content: center;
  margin-top: rem(100);
  button {
    height: rem(80);
    width: 80%;
    background-color: $mainColor;
    color: #fff;
    font-size: rem(32);
    border-radius: rem(10);
  }
}
</style>
