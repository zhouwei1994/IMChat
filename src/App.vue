<template>
  <div id="app">
    <!--页面容器-->
    <transition :name="'pop-' + direction">
      <keep-alive :include="keepList">
        <router-view class="router-view"/>
      </keep-alive>
    </transition>
    <z-navigation></z-navigation>
    <loading v-model="loading"></loading>
  </div>
</template>
<script>
import { mapState, mapMutations } from "vuex";
import loading from "@/components/common/loading";
// 尾部
import zNavigation from "@/components/navigation";
export default {
  components: {
    loading,
    zNavigation
  },
  data() {
    return {
      keepList: []
    };
  },
  computed: {
    ...mapState(["loading", "direction", "keepAliveList"])
  },
  watch: {
    keepAliveList(val) {
      // this.keepList = val.join(",");
    }
  },
  created() {
    this.setCacheData();
    // this.keepList = this.keepAliveList.join(",");
  },
  methods: {
    ...mapMutations(["setCacheData"])
  },
  mounted() {}
};
</script>
<style lang="scss">
@import "src/style/init";
@import "src/style/common";
@import "src/style/icon";
@import "../node_modules/swiper/dist/css/swiper.min.css";
/**
* vue-router transition
*/

.router-view {
  width: 100%;
  animation-fill-mode: both;
  backface-visibility: hidden;
}

.pop-out-enter-active,
.pop-out-leave-active,
.pop-in-enter-active,
.pop-in-leave-active {
  will-change: transform;
  height: 100%;
  position: fixed;
  left: 0;
}

.pop-out-enter-active {
  animation-duration: 0.3s;
  animation-name: popInLeft;
}

.pop-out-leave-active {
  animation-duration: 0.3s;
  animation-name: popOutRight;
}

.pop-in-enter-active {
  perspective: 1000;
  animation-duration: 0.3s;
  animation-name: popInRight;
}

.pop-in-leave-active {
  animation-duration: 0.3s;
  animation-name: popOutLeft;
}
.pop-fade-leave-active {
  display: none;
}
@keyframes popInLeft {
  from {
    transform: translate3d(-100%, 0, 0);
  }
  to {
    transform: translate3d(0, 0, 0);
  }
}

@keyframes popOutLeft {
  from {
    opacity: 1;
  }
  to {
    transform: translate3d(-100%, 0, 0);
  }
}

@keyframes popInRight {
  from {
    opacity: 0;
    transform: translate3d(100%, 0, 0);
  }
  to {
    opacity: 1;
    transform: none;
  }
}

@keyframes popOutRight {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
    transform: translate3d(100%, 0, 0);
  }
}
</style>

