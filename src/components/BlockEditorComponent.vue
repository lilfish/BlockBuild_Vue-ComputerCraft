<template>
  <div>
    <div id="container"></div>
    <grid-controls
      :grids="grids"
      v-on:grids="updateGrid"
      class="grid-controls"
    ></grid-controls>
  </div>
</template>

<script>
import * as Three from 'three'
import GridControls from './GridControls.vue'
import blockScript from '../scripts/blockScript.js'

var OrbitControls = require('three-orbit-controls')(Three)

export default {
  name: 'ThreeTest',
  components: {
    GridControls
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
      grids: [
        {
          color: "red",
          size: 2,
          visible: false
        },
        {
          color: "red",
          size: 2,
          visible: false
        },
        {
          color: "green",
          size: 2,
          visible: false
        },
        {
          color: "green",
          size: 2,
          visible: false
        },
        {
          color: "blue",
          size: 2,
          visible: false
        },
        {
          color: "blue",
          size: 2,
          visible: false
        }
      ]
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
      // Light
      this.light = new Three.DirectionalLight(0xffffff);
      this.light.position.set(1, 1, 1);
      this.scene.add(this.light);
      this.light = new Three.DirectionalLight(0x002288);
      this.light.position.set(- 1, - 1, - 1);
      this.scene.add(this.light);
      this.light = new Three.AmbientLight(0x222222);
      this.scene.add(this.light);
      // Add cube
      let geometry = new Three.BoxGeometry();
      let material = new Three.MeshBasicMaterial({ color: 0xffffff, flatShading: true });
      this.cube = new Three.Mesh(geometry, material);
      this.scene.add(this.cube);
      // Add grid
      this.updateGrid();
    },
    // Block scripts
    ...blockScript,
    // Cube controls keyboard
    cubeKeyControls(e) {
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
        this.createBlock();
      } else if (e.key == "q") {
        this.removeBlock();
      }
      this.updateGrid();
    }
  },
    // Update grid
    updateGrid (value = this.grids) {
      this.grids = value;
      for (let i = 0; i < this.grids.length; i++) {
        let gridSize = (this.grids[i].size * 2) + 1;
        if (this.grids[i].grid != null) {
          this.scene.remove(this.grids[i].grid);
        }

        this.grids[i].grid = new Three.GridHelper(gridSize, gridSize);

        this.grids[i].grid.position.x = this.cube.position.x
        this.grids[i].grid.position.z = this.cube.position.z
        this.grids[i].grid.position.y = this.cube.position.y

        switch (i) {
          case 0: //red
            this.grids[i].grid.position.x += 0.5;
            this.grids[i].grid.rotation.z = Math.PI / 2;
            break;
          case 1: //red
            this.grids[i].grid.position.x -= 0.5;
            this.grids[i].grid.rotation.z = Math.PI / 2 * -1
            break;
          case 2: //green
            this.grids[i].grid.position.y += 0.5;
            break;
          case 3: //green
            this.grids[i].grid.position.y -= 0.5;
            break;
          case 4: //blue
            this.grids[i].grid.position.z += 0.5;
            this.grids[i].grid.rotation.x = Math.PI / 2
            break;
          case 5: //blue
            this.grids[i].grid.position.z -= 0.5;
            this.grids[i].grid.rotation.x = Math.PI / 2 * -1
            break;
        }

        this.grids[i].grid.visible = this.grids[i].visible;

        this.scene.add(this.grids[i].grid);

        if (this.grids[i].grid.visible) {
          console.log("size: ", this.grids[i]);
        }
        // this.grid.z.visible = this.gridSettings[3].visible;
      }
      // let gridSize_z = (this.gridSettings[3].size * 2) + 1
      // this.grid.z = new Three.GridHelper(gridSize_z, gridSize_z);
      // this.grid.z.position.x = this.cube.position.x - 0.5;
      // this.grid.z.position.y = this.cube.position.y;
      // this.grid.z.position.z = this.cube.position.z;
      // this.grid.z.visible = this.gridSettings[3].visible;
      // this.grid.z.rotation.z = Math.PI / 2;
    },
    // Create blocks (Move this to block actions?)
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
.grid-controls {
  position: absolute;
  top: 20px;
  right: 20px;
  border-radius: 20px;
}
</style>