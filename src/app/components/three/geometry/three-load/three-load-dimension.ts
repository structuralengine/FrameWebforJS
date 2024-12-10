import * as THREE from "three";

import { ThreeLoadText3D } from "./three-load-text";

export class ThreeLoadDimension extends THREE.Group {
  private static readonly lineMaterial = new THREE.LineBasicMaterial({
    color: 0x000000,
  });

  constructor(points: THREE.Vector3[][], textStr: string) {
    super();

    // 寸法線と寸法補助線の描画
    points.forEach((p) => {
      this.add(this.getLine(p));
    });

    // 寸法線の両端の座標
    const pxS = points[points.length - 1][0];
    const pxE = points[points.length - 1][1];
    // 寸法補助線(の内の1本)の両端の座標
    const pyS = points[0][0];
    const pyE = points[0][1];

    // 寸法線の中間点の座標
    const position = pxS.clone().lerp(pxE, 0.5);
    // 寸法値テキストの左から右への向きを指すベクトル
    const vx = pxE.clone().sub(pxS);
    // 寸法値テキストの上向きを指すベクトル
    const vy = pyE.clone().sub(pyS);
    // 寸法値テキストの描画
    const text = new ThreeLoadText3D(textStr, position, 0.08, {
      vx: vx,
      vy: vy,
      hAlign: "center",
      vAlign: "bottom",
    });
    text.name = "text";
    text.scale.set(1, 2, 0); // 縦長

    this.add(text);
  }

  private getLine(positions: THREE.Vector3[]): THREE.Line {
    const line_geo = new THREE.BufferGeometry().setFromPoints(positions);
    const line = new THREE.Line(line_geo, ThreeLoadDimension.lineMaterial);
    line.name = "line";

    return line;
  }
}
