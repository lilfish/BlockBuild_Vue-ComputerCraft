<template>
  <div id="app">
    <block-editor/>
  </div>
</template>

<script>

import BlockEditor from './components/BlockEditorComponent.vue'
export default {
  name: 'App',
  components: {
    BlockEditor,
  },
}
</script>

<style lang="scss">
#app {
  padding: 0;
  margin: 0;
}
</style>
