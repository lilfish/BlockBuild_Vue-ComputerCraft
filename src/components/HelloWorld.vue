<template>
<div>
  <div id="container"></div>
  <grid-controls class="grid-controls"></grid-controls>
</div>
</template>

<script>
import * as Three from 'three'
import GridControls from './GridControls.vue'
var OrbitControls = require('three-orbit-controls')(Three)

export default {
  name: 'ThreeTest',
  components: {
    GridControls
  },
  props: {
    gridSettings: {
      required: true,
      type: Object
    }
  },
  data () {
    return {
      camera: null,
      scene: null,
      renderer: null,
      controls: null,
      light: null,
      cube: null,
      blocks: [],
      grid: {
        x: null,
        y: null,
        z: null
      }
    }
  },
  methods: {
    init: function () {
      let container = document.getElementById('container');
      this.scene = new Three.Scene();

      this.camera = new Three.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 1, 10000);

      this.renderer = new Three.WebGLRenderer({ antialias: true });
      this.renderer.setSize(container.clientWidth, container.clientHeight);
      container.appendChild(this.renderer.domElement);
      // Set camera controls
      this.controls = new OrbitControls(this.camera, this.renderer.domElement);
      this.camera.position.set(0, 0, 10);
      this.controls.update();
      // Add cube
      let geometry = new Three.BoxGeometry();
      let material = new Three.MeshBasicMaterial({ color: 0xffffff, flatShading: true });
      this.cube = new Three.Mesh(geometry, material);
      this.scene.add(this.cube);
      // Add grid
      this.updateGrid();
      // Light
      this.light = new Three.DirectionalLight(0xffffff);
      this.light.position.set(1, 1, 1);
      this.scene.add(this.light);

      this.light = new Three.DirectionalLight(0x002288);
      this.light.position.set(- 1, - 1, - 1);
      this.scene.add(this.light);

      this.light = new Three.AmbientLight(0x222222);
      this.scene.add(this.light);
    },
    cubeKeyControls (e) {
      if (this.cube && this.cube.visible) {
        if (e.key == "s") {
          this.cube.position.z += 1;
        } else if (e.key == "w") {
          this.cube.position.z -= 1;
        } else if (e.key == "a") {
          this.cube.position.x -= 1;
        } else if (e.key == "d") {
          this.cube.position.x += 1;
        } else if (e.keyCode == 32) { //Spatie
          this.cube.position.y += 1;
        } else if (e.key == "Shift") {
          this.cube.position.y -= 1;
        } else if (e.key == "e") {
          this.createCube();
        } else if (e.key == "q") {
          this.removeCube();
        }
        this.grid.x.position.x = this.cube.position.x;
        this.grid.x.position.y = this.cube.position.y - 0.5;
        this.grid.x.position.z = this.cube.position.z;
        this.grid.y.position.x = this.cube.position.x;
        this.grid.y.position.y = this.cube.position.y;
        this.grid.y.position.z = this.cube.position.z - 0.5;
        this.grid.z.position.x = this.cube.position.x - 0.5;
        this.grid.z.position.y = this.cube.position.y;
        this.grid.z.position.z = this.cube.position.z;
      }
    },
    updateGrid () {
      this.scene.remove(this.grid.x);
      this.scene.remove(this.grid.y);
      this.scene.remove(this.grid.z);
      // X
      let gridSize_x = (this.gridSettings[1].size * 2) + 1
      this.grid.x = new Three.GridHelper(gridSize_x, gridSize_x);
      this.grid.x.position.x = this.cube.position.x;
      this.grid.x.position.y = this.cube.position.y - 0.5;
      this.grid.x.position.z = this.cube.position.z;
      this.grid.x.visible = this.gridSettings[1].visible;
      // Y
      let gridSize_y = (this.gridSettings[2].size * 2) + 1
      this.grid.y = new Three.GridHelper(gridSize_y, gridSize_y);
      this.grid.y.position.x = this.cube.position.x;
      this.grid.y.position.y = this.cube.position.y;
      this.grid.y.position.z = this.cube.position.z - 0.5;
      this.grid.y.visible = this.gridSettings[2].visible;
      this.grid.y.rotation.x = Math.PI / 2;
      // Z
      let gridSize_z = (this.gridSettings[3].size * 2) + 1
      this.grid.z = new Three.GridHelper(gridSize_z, gridSize_z);
      this.grid.z.position.x = this.cube.position.x - 0.5;
      this.grid.z.position.y = this.cube.position.y;
      this.grid.z.position.z = this.cube.position.z;
      this.grid.z.visible = this.gridSettings[3].visible;
      this.grid.z.rotation.z = Math.PI / 2;
      // Add grids
      this.scene.add(this.grid.x);
      this.scene.add(this.grid.y);
      this.scene.add(this.grid.z);
    },
    createCube () {
      if (this.scene.getObjectByName(`x${this.cube.position.x}y${this.cube.position.y}z${this.cube.position.z}`) == undefined) {
        let geometry = new Three.BoxGeometry();
        let material = new Three.MeshBasicMaterial({ color: 0x44ffff, flatShading: true });
        let block = new Three.Mesh(geometry, material);
        block.position.x = this.cube.position.x;
        block.position.y = this.cube.position.y;
        block.position.z = this.cube.position.z;
        block.name = `x${this.cube.position.x}y${this.cube.position.y}z${this.cube.position.z}`;
        block.block = "wood";
        this.blocks.push(block);
        this.scene.add(this.blocks[this.blocks.length - 1]);
      }
    },
    removeCube () {
      var selectedObject = this.scene.getObjectByName(`x${this.cube.position.x}y${this.cube.position.y}z${this.cube.position.z}`);
      this.scene.remove(selectedObject);
    },
    getSceneBlocks(){
      this.scene.traverse(function (object) {
        if (object.block) {
          console.log(object.name, object.position.x, object.position.y, object.position.z, object.block);
        }
      });
    },
    animate: function () {
      requestAnimationFrame(this.animate);
      this.renderer.render(this.scene, this.camera);
    }
  },
  watch: {
    gridSettings: {
      deep: true,
      handler () {
        this.updateGrid()
      }
    }
  },
  mounted () {
    this.init();
    this.animate();
  },
  created () {
    window.addEventListener('keydown', (e) => {
      this.cubeKeyControls(e);
    });

  }
}
</script>

<style scoped>
/* TODO give container a size */
#container {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}
.grid-controls{
  position: absolute;
  top: 20px;
  right: 20px;
  border-radius: 20px;
}
</style>