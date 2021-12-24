<template>
  <div class="under-input">
    <van-icon class="icon" v-if="icon" :name="icon" />
    <input
      :maxlength="maxLength"
      :placeholder="placeholder"
      :type="type"
      :value="modelValue"
      @input="handleInput"
    />
  </div>
  <p v-if="tips" class="tips">{{ tips }}</p>
</template>
<script setup lang="ts">
// 特别注意：接口类型需要使用 import type 否则编译出错
import type { PropType } from 'vue'

const emits = defineEmits(['update:modelValue'])
const props = defineProps({
  type: {
    type: String as PropType<string>,
    default: 'text',
  },
  modelValue: {
    type: String as PropType<string>,
    default: '',
  },
  placeholder: {
    type: String as PropType<string>,
    default: '',
  },
  tips: {
    type: String as PropType<string>,
    default: '',
  },
  icon: {
    type: String as PropType<string>,
    default: '',
  },
  maxLength: {
    type: Number as PropType<number>,
    default: 999,
  },
})

const handleInput = (e: any) => {
  // ctx
  emits('update:modelValue', ((e as InputEvent).target as HTMLInputElement).value)
}
</script>
<style lang="scss" scoped>
.under-input {
  border-bottom: 1px solid #ddd;
  padding: 0.5rem 0.5rem 1rem 0.5rem;
  display: flex;
  align-items: center;
}
input {
  outline: none;
  border: none;
  font-size: 1.2rem;
  width: 100%;
}
.tips {
  font-size: 0.5rem;
  color: #a6a6a6;
  padding: 0.5rem;
}
.icon {
  padding-right: 0.5rem;
}
</style>
