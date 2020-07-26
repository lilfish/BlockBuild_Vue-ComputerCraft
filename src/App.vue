<template>
  <div id="app">
    <BlockEditorComponent/>
  </div>
</template>

<script>

import BlockEditorComponent from './components/BlockEditorComponent.vue'
export default {
  name: 'App',
  components: {
    BlockEditorComponent,
  },
}
</script>

<style lang="scss">
#app {
  padding: 0;
  margin: 0;
}
</style>
