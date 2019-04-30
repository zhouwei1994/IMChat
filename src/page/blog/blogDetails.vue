<template>
  <div class="blogDetailsPage">
    <z-header>博客详情</z-header>
    <h2>{{pageInfo.title}}</h2>
    <div class="info-box">
      <div>{{pageInfo.time}}</div>
      <div>{{pageInfo.read}}</div>
    </div>
    <div class="content" v-html="pageInfo.content"></div>
  </div>
</template>
<script>
export default {
  name: "blogDetails",
  components: {},
  data() {
    return {
      pageInfo: {}
    };
  },
  methods: {
    pageData() {
      this.$ajax
        .get("csdn_blog_details", {
          objId: this.$route.params.objId
        })
        .then(res => {
          this.pageInfo = res;
        });
    }
  },
  created() {
    this.pageData();
  }
};
</script>
<style lang="scss">
.blogDetailsPage {
  h2 {
    font-size: rem(40);
    padding: rem(30);
    background-color: #fff;
    margin-top: rem(15);
  }
  .info-box {
    display: flex;
    padding: rem(30);
    background-color: #fff;
    margin-top: rem(1);
    justify-content: space-between;
  }
  .content {
    padding: rem(30);
    background-color: #fff;
    width: 100%;
    word-wrap: break-word;
    word-break: normal;
    .has {
      width: 100%;
      margin: rem(8) 0;
      overflow-x: auto;
      background-color: #000;
      padding: rem(8);
      color: #abb2bf !important;
      background: #282c34;
    }
  }
}
</style>
