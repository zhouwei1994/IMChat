<template>
  <header>
    <div class="header_view">
      <div class="backIcon" @click="onBack">
        <svg viewBox="0 0 1024 1024" v-if="!back">
          <path
            d="M256 512.064c0 8.192 3.136 16.384 9.344 22.656l384 351.936a32 32 0 0 0 45.248-45.248L333.248 512.064l361.344-329.472a32 32 0 0 0-45.248-45.248l-384 352.064A32.128 32.128 0 0 0 256 512.064z"
          ></path>
        </svg>
      </div>
      <div class="title">
        <slot></slot>
      </div>
      <div class="features">
        <slot name="right"></slot>
      </div>
    </div>
  </header>
</template>
<script>
// import { mapState, mapMutations } from "vuex";
export default {
  data() {
    return {};
  },

  props: {
    back: {
      type: Boolean,
      default() {
        return false;
      }
    }
  },
  computed: {},
  methods: {
    onBack() {
      if (!this.back) {
        this.$router.go(-1);
      }
    }
  },
  mounted() {
    //获取用户信息
  }
};
</script>
<style lang="scss" scoped>
$headHeight: rem(100);
header {
  height: $headHeight;
  .header_view {
    position: fixed;
    height: $headHeight;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 2;
    background-color: #fff;
    display: flex;
    justify-content: space-between;
    .backIcon {
      height: $headHeight;
      width: $headHeight;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      svg {
        stroke: #333;
        fill: #333;
        height: rem(50);
        width: rem(50);
      }
    }
    .title {
      height: $headHeight;
      line-height: $headHeight;
      color: #333;
      font-size: rem(34);
    }
    .features {
      height: $headHeight;
      width: $headHeight;
      flex-shrink: 0;
    }
  }
}
</style>
