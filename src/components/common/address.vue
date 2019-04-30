<template>
  <div>
    <div class="addresSelectVal">
      <ul>
        <li v-for="(item,index) of addressVal" :key="index" :class="{'select':addressIndex == index}" @click="selectType(index)">{{item.name}}</li>
        <li :class="{'select':selectState == addressIndex}" v-show="selectState < length || selectState >= length &&selectState < 3 && !force" @click="selectType(selectState)">请选择</li>
      </ul>
    </div>
    <div class="addresBox" ref="scroll">
      <ul>
        <li v-for="(item,index) of addressList" :key="index" :class="{'select':addressVal.length > addressIndex && item.objId == addressVal[addressIndex].objId}" @click="selectClick(item)">{{item.name}}</li>
      </ul>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    data: {
      type: Array,
      default() {
        return [];
      }
    },
    length: {
      type: Number,
      default() {
        return 3;
      }
    },
    force: {
      type: Boolean,
      default() {
        return true;
      }
    }
  },
  created() {
    if (this.data instanceof Array) {
      this.addressVal = this.data;
      this.selectState = this.data.length;
    }
  },
  watch: {
    data(val) {
      this.addressVal = val;
      this.selectState = val.length;
    }
  },
  data() {
    return {
      //选出的值
      addressVal: [],
      //当前选择
      addressIndex: 0,
      //选择的值
      addressList: [],
      //请选择的显示
      selectState: 0
    };
  },
  methods: {
    getRegion(uid) {
      this.$ajax("kemean/aid/region", { uid: uid }, { load: false }).then(
        data => {
          if (data.length > 0) {
            this.addressList = data;
            this.$refs.scroll.scrollTop = "0px";
          } else {
            this.$emit("change", this.addressVal);
          }
        }
      );
    },
    //切换对应的类型
    selectType(index) {
      this.addressIndex = index;
      var len = this.addressVal.length;
      if (index == 0) {
        this.getRegion(0);
      } else {
        this.getRegion(this.addressVal[index - 1].objId);
      }
      if (len == this.length) {
        this.selectState = this.length;
      } else if (len == this.length && index == this.length && this.force) {
        this.selectState = index;
      } else {
        this.selectState = index + 1;
      }
    },
    //选择
    selectClick(item) {
      if (this.addressIndex == 0) {
        this.addressVal = [];
      } else {
        this.addressVal.splice(this.addressIndex, this.addressVal.length - 1);
      }
      this.addressVal.push(item);
      if (
        this.addressVal.length < this.length ||
        (this.addressVal.length < 3 && !this.force)
      ) {
        this.getRegion(item.objId);
        this.addressIndex++;
      }
      if (this.addressVal.length >= this.length) {
        this.$emit("change", this.addressVal);
      }
      this.selectState = this.addressVal.length;
    }
  },
  mounted() {
    this.getRegion(0);
  }
};
</script>
<style lang="scss" scoped>
@import "src/style/mixin";
.addresSelectVal {
  padding: 0px rem(10);
  border-bottom: 1px solid #ebebeb;
  box-sizing: border-box;
  background-color: #fff;
}
.addresSelectVal ul {
  display: flex;
  flex-wrap: wrap;
}
.addresSelectVal ul li {
  margin-left: rem(20);
  padding: 0px rem(10);
  height: rem(72);
  line-height: rem(72);
  border-bottom: 2px solid #fff;
  box-sizing: border-box;
  font-size: rem(28);
}
.addresSelectVal ul li:first-child {
  margin-left: 0px;
}
.addresSelectVal ul li.select {
  border-bottom: 2px solid $mainColor;
  color: $mainColor;
}
.addresBox {
  padding: 0px rem(20);
  height: rem(420);
  overflow-y: auto;
  background-color: #fff;
}
.addresBox ul li {
  height: rem(72);
  line-height: rem(72);
  font-size: rem(28);
}
.addresBox ul li.select {
  color: $mainColor;
}
</style>