<template>
  <div id="gridControls"></div>
</template>

<script>
import * as Three from 'three'
var OrbitControls = require('three-orbit-controls')(Three)

export default {
  name: 'GridControls',
  props: {
    grids: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      camera: null,
      container: null,
      scene: null,
      renderer: null,
      controls: null,
      cube: null,
      textureCube: null,
      raycaster: null,
      colors: [],
      basicMaterialNull: null,
      basicMaterialTexture: null,
      seenTexture: null,
      selectedFace: null,
    }
  },
  methods: {
    init: function () {
      this.container = document.getElementById('gridControls');
      this.scene = new Three.Scene();
      this.scene.background = new Three.Color('rgb(26, 26, 26)')

      this.camera = new Three.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 100000);

      this.renderer = new Three.WebGLRenderer({ antialias: true, alpha: true });
      this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
      this.renderer.setClearColor(0x000000, 0);
      this.container.appendChild(this.renderer.domElement);
      // Set camera controls
      this.controls = new OrbitControls(this.camera, this.renderer.domElement);
      this.controls.enableZoom = false;
      this.controls.enablePan = false;
      this.camera.position.set(0, 0, 2.6);
      // Add colors
      let red = new Three.Color('rgb(255, 102, 102)');
      let green = new Three.Color('rgb(0, 230, 115)');
      let blue = new Three.Color('rgb(26, 140, 255)');
      let active_red = new Three.Color('rgb(255, 0, 0)');
      let active_green = new Three.Color('rgb(0, 255, 0)');
      let active_blue = new Three.Color('rgb(0, 0, 255)');
      this.colors = [red, green, blue, active_red, active_green, active_blue];

      // Prepare geometry and material for cube.
      var geometry = new Three.BoxGeometry(1, 1, 1);
      var material = new Three.MeshBasicMaterial({ color: 0xffffff, vertexColors: true });
      // Calculate what the material color should be (active or not active)
      for (let i = 0; i < this.grids.length*2; i++) {
          let gridIndex = Math.floor(i/2);
          let visible = this.grids[gridIndex].visible;
          let colorIndex = Math.floor(i/4)
          if(visible)
            colorIndex += 3;
          let second = i % 2 == 0 ? i + 1 : i - 1;
          geometry.faces[i].color = this.colors[colorIndex];
          geometry.faces[second].color = this.colors[colorIndex];
        }
      // Create and add texture cube;
      this.textureCube = new Three.Mesh(geometry, material);
      this.textureCube.rotation.x = -0.3;
      this.textureCube.rotation.y = -0.5;
      this.scene.add(this.textureCube);
      // Add textures & material
      var textureLoader = new Three.TextureLoader();
      textureLoader.load(require("../assets/eyeIcon.png"), artworkTexture => {
        this.seenTexture = artworkTexture;
        this.basicMaterialNull = new Three.MeshBasicMaterial({
          opacity: 0,
          transparent: true,
        });
        this.basicMaterialTexture = new Three.MeshBasicMaterial({
          map: this.seenTexture,
          transparent: true,
        });
        var materials = [];
        for (let i = 0; i < this.grids.length; i++) {
          const visible = this.grids[i].visible;
          visible ? materials.push(this.basicMaterialTexture) : materials.push(this.basicMaterialNull);
        }
        this.cube = new Three.Mesh(geometry, materials);
        this.cube.rotation.x = -0.3;
        this.cube.rotation.y = -0.5;
        this.scene.add(this.cube);
      });

      this.raycaster = new Three.Raycaster();
    },
    animate: function () {
      requestAnimationFrame(this.animate);
      this.renderer.render(this.scene, this.camera);
    },
    doubleClick_box (event) {
      var offsets = this.container.getBoundingClientRect();
      var vector = new Three.Vector3(
        (event.clientX / offsets.right) * 2 - 1,
        - (event.clientY / offsets.bottom) * 2 + 1, 0.5);
      vector.unproject(this.camera);
      this.raycaster.set(this.camera.position, vector.sub(this.camera.position).normalize());

      var intersects = this.raycaster.intersectObject(this.cube);
      if (intersects[0] != undefined) {
        var index = Math.floor(intersects[0].faceIndex / 2);
        let colorIndex = Math.round((index + 1) / 3);
        let first = intersects[0].faceIndex;
        let second = first % 2 == 0 ? first + 1 : first - 1;

        if (intersects[0].object.material[index].map != null) {
          intersects[0].object.material[index] = this.basicMaterialNull;
          intersects[0].object.geometry.faces[first].color = this.colors[colorIndex];
          intersects[0].object.geometry.faces[second].color = this.colors[colorIndex];
          this.grids[index].visible = false;
        } else {
          intersects[0].object.material[index] = this.basicMaterialTexture;
          intersects[0].object.geometry.faces[first].color = this.colors[3 + colorIndex];
          intersects[0].object.geometry.faces[second].color = this.colors[3 + colorIndex];
          this.grids[index].visible = true;
        }
        intersects[0].object.geometry.elementsNeedUpdate = true;
        intersects[0].object.material.needsUpdate = true;
      }
      this.$emit('grids', this.grids)
    },
    mouseDown (event) {
      var offsets = this.container.getBoundingClientRect();
      var vector = new Three.Vector3(
        (event.clientX / offsets.right) * 2 - 1,
        - (event.clientY / offsets.bottom) * 2 + 1, 0.5);
      vector.unproject(this.camera);
      this.raycaster.set(this.camera.position, vector.sub(this.camera.position).normalize());

      var intersects = this.raycaster.intersectObject(this.cube);
      if (intersects[0] != undefined) {
        this.selectedFace = Math.floor(intersects[0].faceIndex / 2);
      }
    },
    mouseUp () {
      this.selectedFace = null;
    },
    scrollFunction (amount) {
      if (this.selectedFace != null) {
        this.grids[this.selectedFace].size += amount > 0 ? -1 : +1;
        this.$emit('grids', this.grids)
      }
    }
  },
  mounted () {
    this.init();
    this.animate();
  },
  created () {
    window.addEventListener('dblclick', (e) => {
      this.doubleClick_box(e);
    });
    window.addEventListener('wheel', (e) => {
      this.scrollFunction(e.deltaY);
    });
    window.addEventListener('mousedown', (e) => {
      this.mouseDown(e);
    });
    window.addEventListener('mouseup', () => {
      this.mouseUp();
    });
  }
}
</script>

<style scoped>
/* TODO give this.container a size */
#gridControls {
  width: 150px;
  height: 150px;
  position: absolute;
  left: 20px;
  right: 20px;
  border-radius: 100px;
  z-index: 1000000;
  overflow: hidden;
}
</style>