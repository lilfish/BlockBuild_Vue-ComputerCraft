<template>
  <div id="main">
    <input
      @input="update(gridSettings, 1, 'size', $event)"
      type="range"
      id="points"
      name="points"
      min="0"
      max="64"
      :value="gridSettings[1]['size']"
    >
    <br>
    <input
      type="checkbox"
      name="x"
      :checked="gridSettings[1]['visible']"
      @input="updateCheck(gridSettings, 1, 'visible', $event)"
    >
    <label for="x">Show X</label>
    <input
      @input="update(gridSettings, 2, 'size', $event)"
      type="range"
      id="points"
      name="points"
      min="0"
      max="64"
      :value="gridSettings[2]['size']"
    >
    <br>
    <input
      type="checkbox"
      name="z"
      :checked="gridSettings[2]['visible']"
      @input="updateCheck(gridSettings, 2, 'visible', $event)"
    >
    <label for="z">Show Z</label>
    <input
      @input="update(gridSettings, 3, 'size', $event)"
      type="range"
      id="points"
      name="points"
      min="0"
      max="64"
      :value="gridSettings[3]['size']"
    >
    <br>
    <input
      type="checkbox"
      name="y"
      :checked="gridSettings[3]['visible']"
      @input="updateCheck(gridSettings, 3, 'visible', $event)"
    >
    <label for="y">Show Y</label>
    <br><br><hr>
    <code>{{  gridSettings }}</code>
  </div>
</template>

<script>
export default {
  props: {
    gridSettings: {
      required: true,
      type: Object
    }
  },
  methods: {
    update(obj, atr, prop, event) {
      obj[atr][prop] = event.target.value
    },
    updateCheck(obj, atr, prop, event) {
      obj[atr][prop] = event.target.checked
    },
  }
} 
</script>

<style lang="scss" scoped>
#main {
  z-index: 10000;
  position: absolute;
  top: 30px;
  left: 30px;
  width: 200px;
  height: 300px;
  background-color: white;
  border-radius: 20px;
  padding: 20px;
}
</style>
