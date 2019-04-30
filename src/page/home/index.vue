<template>
  <div>
    <!-- 轮播图 -->
    <swiper class="mod-banner-scroll" :options="swiperOption">
      <swiper-slide v-for="(item,index) of colorList" :key="index">
        <div :style="`backgroundColor:${item}`">
          {{item}}{{index}}
        </div>
      </swiper-slide>
      <!-- 如果需要分页器 -->
      <div class="swiper-pagination" slot="pagination"></div>
    </swiper>
  </div>
</template>
<script>
import { swiper, swiperSlide } from "vue-awesome-swiper";
export default {
  components: {
    swiper,
    swiperSlide
  },
  data() {
    return {
      colorList: ["red", "yellow", "gray", "pink"],
      swiperOption: {
        autoplay: 3200,
        setWrapperSize: true,
        observeParents: true,
        loop: true,
        speed: 1000,
        //设置分页
        pagination: ".swiper-pagination",
        //设置分页点击
        paginationClickable: true,
        autoplayDisableOnInteraction: false
      }
    };
  },
  methods: {}
};
</script>
<style lang="scss" scoped>
@import "src/style/mixin";
.swiper-container {
  width: 100%;
  height: rem(300);
  .swiper-slide div {
    height: rem(300);
  }
}
</style>
