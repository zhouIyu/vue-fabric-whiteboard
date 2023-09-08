<script lang="ts" setup>
import { defineComponent, onMounted, ref } from 'vue'
import ToolContainer from '@/components/Tool.vue'

defineComponent({
  name: 'HomeView'
})

import Editor from '@/core/index'

const editor = ref<Editor>()

onMounted(() => {
  editor.value = new Editor('canvas')
})

const setType = function (type: string) {
  editor.value?.setType(type)
}
</script>
<template>
  <div class="wrapper">
    <ToolContainer @set-type="setType" />
    <div class="canvas-box">
      <canvas id="canvas"></canvas>
    </div>
  </div>
</template>
<style scoped lang="scss">
.canvas-box {
  width: calc(100% - 150px);
  height: 100%;
  margin-left: 150px;

  #canvas {
    border: 1px solid #ccc;
  }
}
</style>
