import { Injectable } from '@angular/core';
import * as THREE from "three";
global.THREE = THREE;
const createGeometry = require("three-bmfont-text");

@Injectable({
  providedIn: 'root'
})
export class ThreeLoadTextBmf {

  private text_mat: THREE.MeshBasicMaterial[];

  constructor() {
    this.text_mat = [
      new THREE.MeshBasicMaterial({ color: 0x000000 }),
      new THREE.MeshBasicMaterial({ color: 0x000000 }),
    ];
  }

  // 文字を描く
  public createBMF(
    textString: string,
    position: THREE.Vector2,
    size: number,
    offset: number = 0,
    font: any): THREE.Mesh {

    var geometry = createGeometry({
      align: 'center',
      font: font,
      text: textString
    })

    // change text and other options as desired
    // the options sepcified in constructor will
    // be used as defaults

    // const text_geo = new THREE.TextGeometry(textString, {
    //   font: font,
    //   size: size,
    //   height: 0.001,
    //   curveSegments: 4,
    //   bevelEnabled: false,
    // });

    geometry.center();

    const text = new THREE.Mesh(geometry, this.text_mat);

    text.position.set(position.x, position.y + offset, 0);

    return text;
  }

}
