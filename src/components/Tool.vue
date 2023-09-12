<script lang="ts" setup>
import { defineComponent, inject, onMounted, reactive, ref } from 'vue'
import Editor, { EType, EEvent, eventBus } from '@/core/index'
import IconVue from './Icon.vue'

defineComponent({
  name: 'ToolContainer'
})

type Tool = {
  graph: string[]
  history: string[]
}

const editor = inject<Editor>('editor')

const tool = reactive<Tool>({
  graph: [...Object.values(EType)],
  history: ['redo', 'undo']
})

const currentType = ref<string>(EType.SELECT)
const isCanUndo = ref<boolean>(false)
const isCanRedo = ref<boolean>(false)

onMounted(() => {
  eventBus?.on(EEvent.CHANGE_GRAPH_TYPE, (type: string) => {
    currentType.value = type
  })
  eventBus?.on(EEvent.CHANGE_UNDO_TYPE, (type: boolean) => {
    isCanUndo.value = type
  })
  eventBus?.on(EEvent.CHANGE_REDO_TYPE, (type: boolean) => {
    isCanRedo.value = type
  })
})

const setHistoryType = (name: string) => {
  if (name === 'redo') {
    return !isCanRedo.value
  } else if (name === 'undo') {
    return !isCanUndo.value
  }
}

const changeHistory = (name: string) => {
  if (name === 'redo') {
    editor?.history.redo()
  } else if (name === 'undo') {
    editor?.history.undo()
  }
}

const setType = function (type: string) {
  currentType.value = type
  editor?.setType(type)
}
</script>
<template>
  <div class="tool-container">
    <template v-for="item in tool.graph" :key="item">
      <div class="tool-item" :class="{ active: item === currentType }" @click="setType(item)">
        <IconVue :iconName="item" />
      </div>
    </template>
    <template v-for="item in tool.history" :key="item">
      <div
        class="tool-item"
        :class="{ disabled: setHistoryType(item) }"
        @click="changeHistory(item)"
      >
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

    &.disabled {
      color: #ccc;
      cursor: not-allowed;
    }

    .icon {
      font-size: 30px;
    }
  }
}
</style>
