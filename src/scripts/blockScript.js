import * as Three from 'three'

export default {
  createBlock({x, y, z } = this.cube.position) {
    if (this.scene.getObjectByName(`x${x}y${y}z${z}`) == undefined) {
      let geometry = new Three.BoxGeometry();
      let material = new Three.MeshBasicMaterial({
        color: 0x44ffff,
        flatShading: true
      });
      let block = new Three.Mesh(geometry, material);
      block.position.x = x;
      block.position.y = y;
      block.position.z = z;
      block.name = `x${x}y${y}z${z}`;
      block.block = "wood";
      this.blocks.push(block);
      this.scene.add(this.blocks[this.blocks.length - 1]);
    }
  },
  removeBlock({x, y, z } = this.cube.position) {
    var selectedObject = this.scene.getObjectByName(`x${x}y${y}z${z}`);
    this.scene.remove(selectedObject);
  },
  getSceneBlocks() {
    this.scene.traverse(function (object) {
      if (object.block) {
        console.log(object.name, object.position.x, object.position.y, object.position.z, object.block);
      }
    });
  }
}