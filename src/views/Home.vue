<script lang="ts" setup>
import { defineComponent, onMounted, provide } from 'vue'
import ToolContainer from '@/components/Tool.vue'

defineComponent({
  name: 'HomeView'
})

import Editor from '@/core/index'

const editor = new Editor()

onMounted(() => {
  editor.init('canvas')
})

provide('editor', editor)
</script>
<template>
  <div class="wrapper">
    <ToolContainer />
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
@/core/types
