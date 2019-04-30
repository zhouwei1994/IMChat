<template>
  <div @touchmove="onTouchMove">
    <transition :name="maskTransition">
      <div class="mask" @click="hideOnBlur && (currentValue = false)" v-show="currentValue"></div>
    </transition>
    <input style="display:none" v-model="currentValue">
    <transition :name="dialogTransition">
      <div class="popupBox" v-show="currentValue" >
        <slot></slot>
      </div>
    </transition>
  </div>
</template>
<script>
export default {
  props: {
    value: {
      type: Boolean,
      default: false
    },
    maskTransition: {
      type: String,
      default: 'vux-mask'
    },
    dialogTransition: {
      type: String,
      default: 'slide-fade'
    },
    hideOnBlur:{
    	default:function(){
			return true
		}
    },
    scroll: {
      type: Boolean,
      default: true
    }
  },
  created () {
    if (typeof this.value !== 'undefined') {
      this.currentValue = this.value
    }
  },
  watch: {
    value (val) {
      this.currentValue = val
    },
    currentValue (val) {
      this.$emit(val ? 'on-show' : 'on-hide')
      this.$emit('input', val)
    }
  },
  data () {
    return {
      currentValue: false
    }
  },
  methods: {
    onTouchMove: function (event) {
      !this.scroll && event.preventDefault()
    }
  }
}
</script>
<style scoped>
/*遮罩层*/
.mask {
	position: fixed;
	z-index: 501;
	top: 0;
	right: 0;
	left: 0;
	bottom: 0;
	background: rgba(0,0,0,0.5);
}
.popupBox {
	position: fixed;
	bottom: 0px;
	left: 0px;
	max-width: 100%;
	max-height: 100%;
	min-width: 100%;
	min-height: 50px;
	background: #FFF;
	z-index: 502;
	transform: translateY(0%);
	font-size: 0.3rem;
}
.slide-fade-enter-active {
  transition: all .3s ease;
}
.slide-fade-leave-active {
  transition: all .3s ease;
}
.slide-fade-enter, .slide-fade-leave-active {
  transform: translateY(100%);
  opacity: 0;
}
</style>