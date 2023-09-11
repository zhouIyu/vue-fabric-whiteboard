<script lang="ts" setup>
import { defineComponent, inject, onMounted, ref } from 'vue'
import Editor, { EType, EEvent } from '@/core/index'
import IconVue from './Icon.vue'

defineComponent({
  name: 'ToolContainer'
})

const editor = inject<Editor>('editor')

const toolList = ref<string[]>([...Object.values(EType)])

const currentType = ref<string>(EType.SELECT)

onMounted(() => {
  const eventBus = editor?.getEventBus()
  eventBus?.on(EEvent.CHANGE_TYPE, (type: string) => {
    currentType.value = type
  })
})

const setType = function (type: string) {
  currentType.value = type
  editor?.setType(type)
}
</script>
<template>
  <div class="tool-container">
    <template v-for="item in toolList" :key="item">
      <div class="tool-item" :class="{ active: item === currentType }" @click="setType(item)">
        <IconVue :iconName="item" />
      </div>
    </template>
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

    &.active {
      color: #409eff;
    }

    .icon {
      font-size: 30px;
    }
  }
}
</style>
