<template>
  <div id="app">
    <HelloWorld :gridSettings="gridSettings"/>
    <!-- <Controls :gridSettings="gridSettings"></Controls> -->
  </div>
</template>

<script>

import HelloWorld from './components/HelloWorld.vue'
// import Controls from './components/Controls.vue'
export default {
  name: 'App',
  components: {
    HelloWorld,
    // Controls
  },
  data() {
    return {
      gridSettings: {
        1: {
          size: 4,
          visible: true
        },
        2: {
          size: 4,
          visible: false
        },
        3: {
          size: 4,
          visible: false
        }
      }
    }
  },
}
</script>

<style lang="scss">
#app {
  padding: 0;
  margin: 0;
}
</style>
