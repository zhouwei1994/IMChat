<template>
  <popup v-model="calendarShow" class="calendarPopup">
    <div class="calendarTitle">
      <span></span>
      <p>时间选择</p>
      <span @click="calendarShow = false">×</span>
    </div>
    <z-calendar :range="calendar.range" :zero="calendar.zero" :begin="calendar.begin || []" :end="calendar.end || []" :lunar="calendar.lunar" :value="calendar.value"  @select="calendarChange"></z-calendar>
  </popup>
</template>
<script>
import Popup from "./popup.vue";
import zCalendar from "./calendar";
export default {
  components: {
    Popup,
    zCalendar
  },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    calendar: {
      type: Object,
      default: {}
    }
  },
  created() {
    this.calendarShow = this.value;
  },
  watch: {
    calendarShow(val) {
      this.$emit(val ? "on-show" : "on-hide");
      this.$emit("input", val);
    },
    value(val) {
      this.calendarShow = val;
    }
  },
  data() {
    return {
      calendarShow: false
    };
  },
  methods: {
    calendarChange(val) {
      this.calendarShow = false;
      this.calendar.select(val);
    }
  },
  mounted() {
  }
};
</script>
<style lang="scss" scoped>
@import "src/style/mixin";
.calendarPopup {
  width: 100vw;
}
.calendarTitle {
  display: flex;
  justify-content: space-between;
  height: rem(88);
  line-height: rem(88);
  border-bottom: 1px solid #ebebeb;
  width: 100vw;
}
.calendarTitle p {
  font-size: rem(32);
}
.calendarTitle span {
  width: rem(80);
  flex-shrink: 0;
  text-align: center;
}
.calendarTitle span:last-child {
  font-size: rem(52);
  color: #999;
}
</style>