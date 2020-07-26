<template>
  <div id="gridControls"></div>
</template>

<script>
import * as Three from 'three'
var OrbitControls = require('three-orbit-controls')(Three)

export default {
  name: 'GridControls',
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
      this.container = document.getElementById('gridControls');
      this.scene = new Three.Scene();
      this.scene.background = new Three.Color('black')

      this.camera = new Three.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 100000);

      this.renderer = new Three.WebGLRenderer({ antialias: true, alpha: true });
      this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
      this.renderer.setClearColor(0x000000, 0);
      this.container.appendChild(this.renderer.domElement);
      // Set camera controls
      this.controls = new OrbitControls(this.camera, this.renderer.domElement);
      this.controls.enableZoom = false;
      this.controls.enablePan = false;
      this.camera.position.set(0, 0, 2.5);
      // Add colors
      let red = new Three.Color(1, 0, 0);
      let green = new Three.Color(0, 1, 0);
      let blue = new Three.Color(0, 0, 1);
      this.colors = [red, green, blue];

      // Add cube
      let geometry = new Three.BoxGeometry(1, 1, 1);
      for (var i = 0; i < 3; i++) {
        geometry.faces[4 * i].color = this.colors[i];
        geometry.faces[4 * i + 1].color = this.colors[i];
        geometry.faces[4 * i + 2].color = this.colors[i];
        geometry.faces[4 * i + 3].color = this.colors[i];
      }
      var material = new Three.MeshBasicMaterial({ color: 0xffffff, vertexColors: true });

      this.textureCube = new Three.Mesh(geometry, material);
      this.textureCube.rotation.y = 45;
      this.textureCube.rotation.x = -0.5;
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
        var materials = [
          this.basicMaterialNull,
          this.basicMaterialNull,
          this.basicMaterialNull,
          this.basicMaterialTexture,
          this.basicMaterialNull,
          this.basicMaterialNull,
        ];
        this.cube = new Three.Mesh(geometry, materials);
        this.cube.rotation.y = 45;
        this.cube.rotation.x = -0.5;
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
        if (intersects[0].object.material[index].map != null) {
          intersects[0].object.material[index] = this.basicMaterialNull;
          this.grids[index].visible = false;
        } else {
          intersects[0].object.material[index] = this.basicMaterialTexture;
          this.grids[index].visible = true;
        }
        intersects[0].object.material.needsUpdate = true;
      }
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
    scrollFunction(amount){
      if(this.selectedFace != null){
        this.grids[this.selectedFace].size += amount > 0 ? 1 : -1;
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
  width: 200px;
  height: 200px;
  position: absolute;
  left: 20px;
  right: 20px;
  border-radius: 100px;
  z-index: 1000000;
  overflow: hidden;
}
</style>