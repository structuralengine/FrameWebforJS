import { Injectable } from '@angular/core';
import * as THREE from "three";
import { LineBasicMaterial } from 'three';

import { ThreeLoadText } from "./three-load-text";

@Injectable({
  providedIn: 'root'
})
export class ThreeLoadPoint {

  private text: ThreeLoadText;

  constructor(text: ThreeLoadText) {
    this.text = text;
  }

  /// 節点荷重を編集する
  // target: 編集対象の荷重,
  // node: 基準点,
  // offset: 配置位置（その他の荷重とぶつからない位置）
  // value: 荷重値,
  // length: 表示上の長さ,
  // direction: 荷重の向き(tx, ty, tz)
  public create(
    position: any,
    offset: number,
    value: number,
    length: number,
    direction: string,
    row: number
  ): THREE.Group {


    //線の色を決める
    let line_color = 0xff0000;
    if (direction === "ty") {
      line_color = 0x00ff00;
    } else if (direction === "tz") {
      line_color = 0x0000ff;
    }

    const child = new THREE.Group();
    child.name = "child";

    // 色を変更する
    const origin = new THREE.Vector3(-1, 0, 0);
    const dir = new THREE.Vector3(1, 0, 0); // 矢印の方向（単位ベクトル）
    const arrow = new THREE.ArrowHelper(dir, origin, 1, line_color);
    arrow.name = "arrow";
    child.add(arrow);

    // 長さを修正する
    if (value < 0) {
      child.rotation.set(-Math.PI, 0, -Math.PI);
    }
    child.scale.set(length, length, length);

    const group0 = new THREE.Group();

    /*/ 文字を追加する
    const textStr: string = value.toFixed(2);
    const size: number = 0.1;
    const vartical: string = 'bottom';
    let horizontal: string;
    let pos: THREE.Vector2;
    if (value < 0) {
      horizontal = 'right';
      pos = new THREE.Vector2(length, 0);
    } else {
      horizontal = 'left';
      pos = new THREE.Vector2(-length, 0);
    }
    const text = this.text.create(textStr, pos, size, horizontal, vartical);
    text.name = "text";
    text.visible = false;
    group0.add(text);
    */

    child.position.y = offset;

    group0.add(child);
    group0.name = "group";

    const group = new THREE.Group();
    group.add(group0);

    group.name = "PointLoad-" + row.toString() + '-' + direction.toString();
    group['value'] = value; //値を保存

    // 向きを変更する
    if (direction === "ty") {
      group.rotation.set(Math.PI / 2, Math.PI / 2, 0);
    } else if (direction === "tz") {
      group.rotation.set(-Math.PI / 2, 0, -Math.PI / 2);
    }

    // 位置を修正する
    group.position.set(position.x, position.y, position.z);

    return group;
  }

  // 大きさを反映する
  public setSize(group: any, size: number): void {
    for (const item of group.children) {
      item.scale.set(size, size, size);
    }
  }

  // オフセットを反映する
  public setOffset(group: THREE.Group, offset: number): void {
    for (const item of group.children) {
      item.position.x = offset;
    }
  }

  // スケールを反映する
  public setScale(group: any, scale: number): void {
    group.scale.set(scale, scale, scale);
  }

  // ハイライトを反映させる
  public setColor(group: any, n: string): void {

    //置き換えるマテリアルを生成 -> colorを設定し，対象オブジェクトのcolorを変える
    const line_mat_Red = new THREE.LineBasicMaterial({ color: 0xff0000 });
    const line_mat_Green = new THREE.LineBasicMaterial({ color: 0x00ff00 });
    const line_mat_Blue = new THREE.LineBasicMaterial({ color: 0x0000ff });
    const line_mat_Pick = new THREE.LineBasicMaterial({ color: 0xafeeee });  //ハイライトカラー
    const arrow_mat_Red = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const arrow_mat_Green = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const arrow_mat_Blue = new THREE.MeshBasicMaterial({ color: 0x0000ff });
    const arrow_mat_Pick = new THREE.MeshBasicMaterial({ color: 0xafeeee });  //ハイライトカラー

    for (let target of group.children[0].children[0].children[0].children) {
      if (n === "clear") {
        if (target.type === 'Line' && group.name.slice(-1) === 'x') {
          target.material = line_mat_Red; //デフォルトのカラー
        } else if (target.type === 'Line' && group.name.slice(-1) === 'y') {
          target.material = line_mat_Green; //デフォルトのカラー
        } else if (target.type === 'Line' && group.name.slice(-1) === 'z') {
          target.material = line_mat_Blue; //デフォルトのカラー
        } else if (target.type === 'Mesh' && group.name.slice(-1) === 'x') {
          target.material = arrow_mat_Red; //デフォルトのカラー
        } else if (target.type === 'Mesh' && group.name.slice(-1) === 'y') {
          target.material = arrow_mat_Green; //デフォルトのカラー
        } else if (target.type === 'Mesh' && group.name.slice(-1) === 'z') {
          target.material = arrow_mat_Blue; //デフォルトのカラー
        }
      } else if (n === "select") {
        if (target.type === 'Line') {
          target.material = line_mat_Pick; //ハイライト用のカラー
        } else if (target.type === 'Mesh' ) {
          target.material = arrow_mat_Pick; //ハイライト用のカラー
        }
        /*if (target.type === 'Line' && group.name.slice(-1) === 'x') {
          target.material = line_mat_Red; //ハイライト用のカラー
        } else if (target.type === 'Line' && group.name.slice(-1) === 'y') {
          target.material = line_mat_Green; //ハイライト用のカラー
        } else if (target.type === 'Line' && group.name.slice(-1) === 'z') {
          target.material = line_mat_Blue; //ハイライト用のカラー
        } else if (target.type === 'Mesh' && group.name.slice(-1) === 'x') {
          target.material = arrow_mat_Red; //ハイライト用のカラー
        } else if (target.type === 'Mesh' && group.name.slice(-1) === 'y') {
          target.material = arrow_mat_Green; //ハイライト用のカラー
        } else if (target.type === 'Mesh' && group.name.slice(-1) === 'z') {
          target.material = arrow_mat_Blue; //ハイライト用のカラー
        }*/
      }
    }
  }
  
}
