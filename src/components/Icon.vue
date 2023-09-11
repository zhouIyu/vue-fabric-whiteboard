<script lang="ts" setup>
import { computed, defineComponent } from 'vue'

defineComponent({
  name: 'IconVue'
})

interface IProps {
  iconName: string
}

const props = defineProps<IProps>()

const icon = computed<string>(() => {
  return `iconfont icon-${props.iconName}`
})
</script>
<template>
  <i class="icon" :class="icon"></i>
</template>
<style scoped lang="scss"></style>
