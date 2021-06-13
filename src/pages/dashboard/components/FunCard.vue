<template>
  <div
    class="fun-card"
    :class="{
      disabled,
    }"
  >
    <div>
      <h1 class="title">{{ title }}</h1>
    </div>
    <span v-if="icon" :class="[icon]" class="iconfont icon"></span>
    <!-- lock -->
    <div v-if="disabled" class="lock">
      <span class="icon-lockclosed iconfont"> </span>
    </div>
  </div>
</template>
<script setup lang="ts">
import { defineProps } from '@vue/runtime-core'
import type { PropType } from '@vue/runtime-core'

const props = defineProps({
  title: {
    type: String as PropType<string>,
    default: '',
    required: true,
  },
  icon: {
    type: String as PropType<string>,
    default: '',
  },
  bgColor: {
    type: String as PropType<string>,
    default: '#000',
  },
  disabled: {
    type: Boolean as PropType<boolean>,
    default: false,
  },
})
</script>
<style lang="scss" scoped>
.fun-card {
  border-radius: 0.5rem;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: space-around;
  background: v-bind(bgColor);
  position: relative;
}
.disabled {
  background-color: #000;
  opacity: 0.5;
}
.title {
  color: #fff;
  font-size: 1.2rem;
}
.icon {
  font-size: 3rem;
}
.lock {
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: #fff;
  opacity: 0.5;
  border-radius: 0.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  span {
    font-size: 2rem;
  }
}
</style>
