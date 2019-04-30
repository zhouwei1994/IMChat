<template>
  <div v-load-more="onLoad" type="1">
    <z-header back>爬虫技术-我的博客</z-header>
    <router-link
      tag="div"
      :to="'/blogDetails/'+item.articleid"
      class="blogList"
      v-for="(item,index) of blogList"
      :key="index"
    >
      <h3>{{item.title}}</h3>
      <p v-html="item.content"></p>
      <div class="info-box">
        <div>{{item.time}}</div>
        <div>阅读数：{{item.read}}</div>
        <div>评论数：{{item.comment}}</div>
      </div>
    </router-link>
  </div>
</template>
<script>
export default {
  name: "index1",
  components: {},
  data() {
    return {
      blogList: [],
      pageSize: 1,
      loadState: true
    };
  },
  methods: {
    onLoad() {
      if (this.loadState) {
        this.loadState = false;
        this.$ajax
          .get("csdn_list", {
            pageSize: this.pageSize
          })
          .then(res => {
            this.pageSize += 1;
            if (res.length == 20) {
              this.loadState = true;
            }
            this.blogList = this.blogList.concat(res);
          })
          .catch(err => {
            this.loadState = true;
          });
      }
    }
  },
  created() {
    this.onLoad();
  }
};
</script>
<style lang="scss" scoped>
.blogList {
  background-color: #fff;
  padding: rem(30);
  margin-top: rem(15);
  &:active {
    background-color: #f5f5f5;
  }
  h3 {
    font-weight: bold;
    font-size: rem(36);
  }
  p {
    margin-top: rem(30);
    color: #333;
    margin-bottom: rem(30);
    @include bov(3);
    line-height: 150%;
  }
  .info-box {
    padding-top: rem(30);
    border-top: 1px solid #eee;
    display: flex;
    justify-content: space-between;
  }
}
</style>
