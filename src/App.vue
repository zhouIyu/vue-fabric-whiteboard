<script setup lang="ts">
import HomeView from './views/Home.vue'
</script>

<template>
  <HomeView />
</template>

<style lang="scss">
html,
body {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

#app {
  width: 100%;
  height: 100%;

  .wrapper {
    width: 100%;
    height: 100%;
  }
}
</style>
