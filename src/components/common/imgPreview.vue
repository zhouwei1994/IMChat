<template>
  <div class="imgPreview" v-show="show">
    <swiper ref="swiper" class="previewSwiper" :options="previewSwiper">
      <swiper-slide class="previewSlide" v-for="(item,index) of previewList" :key="index">
        <img
          v-img.fit
          :maxWidth="availWidth"
          :maxHeight="availHeight"
          v-if="item"
          :src="imgBaseUrl+item"
        >
      </swiper-slide>
    </swiper>
    <span>{{previewIndex + 1}}/{{previewList.length}}</span>
  </div>
</template>
<script>
import { imgBaseUrl } from "@/config/constPool";
import { swiper, swiperSlide } from "vue-awesome-swiper";
export default {
  components: {
    swiper,
    swiperSlide
  },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    data: {
      type: Object,
      default: {
        list: [
          "images/2019-03-15/1552624222932.jpg",
          "images/2019-03-15/1552624222932.jpg",
          "images/2019-03-15/1552624222932.jpg"
        ],
        index: 0
      }
    }
  },
  created() {
    if (typeof this.value !== "undefined") {
      this.show = this.value;
    }
    this.availWidth = window.screen.availWidth;
    this.availHeight = window.screen.availHeight;
  },
  watch: {
    value(val) {
      this.show = val;
      if (val) {
        const _this = this;
        var swiper = this.$refs.swiper.swiper;
        swiper.on("click", function() {
          _this.show = false;
          _this.$emit("input", false);
        });
        swiper.on("slideChange", function() {
          _this.previewIndex = this.activeIndex;
        });
      }
    },
    data(val) {
      this.previewList = val.list;
      this.$refs.swiper.swiper.slideTo(val.index, 1000, false);
    }
  },
  data() {
    return {
      show: false,
      imgBaseUrl: imgBaseUrl,
      availWidth: 360,
      availHeight: 360,
      previewIndex: 0,
      previewList: [
        "images/2019-03-15/1552624222932.jpg",
        "images/2019-03-15/1552624222932.jpg",
        "images/2019-03-15/1552624222932.jpg"
      ],
      previewSwiper: {
        lazy: true,
        on: {
          slideChangeTransitionEnd: function() {
            this.previewIndex = this.activeIndex;
          }
        }
      }
    };
  },
  methods: {},
  mounted() {
    const _this = this;
    if (this.value) {
      var swiper = _this.$refs.swiper.swiper;
      swiper.on("click", function() {
        _this.show = false;
        _this.$emit("input", false);
      });
      swiper.on("slideChange", function() {
        _this.previewIndex = this.activeIndex;
      });
    }
  }
};
</script>
<style lang="scss" scoped>
/*遮罩层*/
.imgPreview {
  position: fixed;
  z-index: 501;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 1);
  .previewSwiper {
    height: 100%;
    width: 100%;
    .previewSlide {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
      width: 100%;
      overflow: hidden;
    }
  }
  span {
    position: absolute;
    bottom: rem(50);
    left: 50%;
    transform: translateX(-50%);
    color: #fff;
  }
}
</style>