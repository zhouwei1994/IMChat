<template>
  <popup v-model="currentValue">
    <div class="addresTitle">
      <span @click="currentValue = false">取消</span>
      <p>所在地区</p>
      <span @click="onConfirm">确定</span>
    </div>
  	<z-address :data="addressVal" @change="addressChange" :length="length" :force="false"></z-address>
  </popup>
</template>
<script>
import Popup from "./popup.vue";
import zAddress from "./address.vue";
export default {
  components: {
    Popup,
    zAddress
  },
  props: {
    data: {
      type: Array,
      default() {
        return [];
      }
    },
    value: {
      type: Boolean,
      default: false
    },
    length: {
      type: Number,
      default:2
    }
  },
  created() {
    if (typeof this.value !== "undefined") {
      this.currentValue = this.value;
    }
    if (this.data instanceof Array) {
      this.addressVal = this.data;
    }
  },
  watch: {
    value(val) {
      this.currentValue = val;
    },
    currentValue(val) {
      this.$emit(val ? "on-show" : "on-hide");
      this.$emit("input", val);
    },
    data(val) {
      this.addressVal = val;
    }
  },
  data() {
    return {
      currentValue: false,
      //选出的值
      addressVal: []
    };
  },
  methods: {
    addressChange(val) {
      console.log(val);
      this.addressVal = val;
    },
    onConfirm() {
      if (parseInt(this.length) <= this.addressVal.length) {
        this.currentValue = false;
        this.$emit("change", this.addressVal);
      }else{
        this.prompt("请选择");
      }
    }
  },
  mounted() {}
};
</script>
<style lang="scss" scoped>
@import "src/style/mixin";
.addresTitle {
  display: flex;
  justify-content: space-between;
  height: rem(88);
  line-height: rem(88);
  border-bottom: 1px solid #ebebeb;
  padding: 0 rem(20);
}
.addresTitle p {
  font-size: rem(32);
}
.addresTitle span {
  width: rem(80);
  flex-shrink: 0;
  text-align: center;
}
.addresTitle span {
  font-size: rem(28);
  color: #999;
}
.addresTitle span:last-child {
  color: $mainColor;
}
</style>