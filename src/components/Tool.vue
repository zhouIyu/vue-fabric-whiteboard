<script lang="ts" setup>
import { defineComponent, ref } from 'vue'
import { EType } from '@/core/index'
import IconVue from './Icon.vue'

defineComponent({
  name: 'ToolContainer'
})

const emit = defineEmits(['setType'])

const toolList = ref<string[]>([...Object.values(EType)])

const setType = function (type: string) {
  emit('setType', type)
}
</script>
<template>
  <div class="tool-container">
    <div class="tool-item" v-for="item in toolList" :key="item" @click="setType(item)">
      <IconVue :iconName="item" />
    </div>
  </div>
</template>
<style scoped lang="scss">
.tool {
  &-container {
    width: 60px;
    border: 1px solid #ccc;
    border-radius: 4px;
    padding: 10px;
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
  }

  &-item {
    margin-bottom: 10px;
    cursor: pointer;
    text-align: center;

    &:hover {
      color: #409eff;
    }
    .icon {
      font-size: 30px;
    }
  }
}
</style>
