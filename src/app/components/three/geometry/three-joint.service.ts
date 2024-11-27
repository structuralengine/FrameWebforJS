import { SceneService } from '../scene.service';
import { InputNodesService } from '../../input/input-nodes/input-nodes.service';
import { InputMembersService } from '../../input/input-members/input-members.service';
import { InputJointService } from '../../input/input-joint/input-joint.service';
import { ThreeNodesService } from './three-nodes.service';
import { Injectable } from '@angular/core';
import * as THREE from 'three';
import { ThreeMembersService } from './three-members.service';

@Injectable({
  providedIn: 'root'
})
export class ThreeJointService {

  private jointList: any[];
  private isVisible: boolean;
  // private currentIndex: string;
  // private currentIndex_sub: string;

  private selectionItem: THREE.Mesh;     // 選択中のアイテム

  constructor(private scene: SceneService,
              private nodeThree: ThreeNodesService,
              private node: InputNodesService,
              private member: InputMembersService,
              private joint: InputJointService,
              private three_member: ThreeMembersService){
      this.jointList = new Array();
      this.isVisible = null;
    }

  public visibleChange(flag: boolean): void {

    this.selectChange(-1, -1)

    if( this.isVisible === flag){
      return;
    }
    for (const mesh of this.jointList) {
      mesh.visible = flag;
    }
    this.isVisible = flag;
  }

  public changeData(index: number): void {

    this.ClearData();

    // 全節点データを入手
    const nodeData = this.node.getNodeJson(0);
    if (Object.keys(nodeData).length <= 0) {
      return;
    }
    // 全部材データを入手
    const memberData = this.member.getMemberJson(0);
    if (Object.keys(memberData).length <= 0) {
      return;
    }
    
    // 変更対象の結合ケースのデータを入手
    const key: string = index.toString();  // 結合ケース番号
    const jointData = this.joint.getJointJson(1, key);
    if (Object.keys(jointData).length <= 0) {
      return;
    } 
    const targetJoint = jointData[key];

    // 各行の結合データに対して処理を実行
    for (const jo of targetJoint) {
      // 結合データが設定されている部材を取得
      if(!(jo.m in memberData)){
        continue;
      }
      const m =  memberData[jo.m];
      if (m === undefined) {
        continue;
      }

      // 部材のi端、j端節点を取得
      const iNode = nodeData[m.ni];
      const jNode = nodeData[m.nj];
      if (iNode === undefined || jNode === undefined) {
        continue;
      }

      // 要素座標系の取得
      // localAxis.xが要素座標系x軸の単位ベクトル、以下y、z同様
      const localAxis = this.three_member.localAxis(iNode.x, iNode.y, iNode.z, jNode.x, jNode.y, jNode.z, m.cg);

      // ピン接合描画オブジェクトの作成
      this.createJointObject(jo, iNode, jNode, localAxis);
    }
  }

  //シートの選択行が指すオブジェクトをハイライトする
  public selectChange(index_row, index_column): void{
    
    //数字(列数)を記号に変換
    const column = index_column;

    //全てのハイライトを元に戻し，選択行のオブジェクトのみハイライトを適応する
    for (let item of this.jointList){

      item['material']['color'].setHex(0X000000); //処理の変更あり

      if (item.name === 'joint' + index_row.toString() + column){

        item['material']['color'].setHex(0X00A5FF); //処理の変更あり
      }
    }

    this.scene.render();
  }

  // ピン接合を示す描画オブジェクトを作成する
  private createJointObject(joint, iNode, jNode, localAxis): void {
      // 描画オブジェクトのオフセット長の設定
      const len = Math.sqrt((jNode.x - iNode.x) ** 2 + (jNode.y - iNode.y) ** 2 + (jNode.z - iNode.z) ** 2);  // 部材長
      const offset = Math.min(0.1, len * 0.25);  // 基本は端部から0.1mの位置で部材が短い場合は部材長の1/4の位置
      let offsetVec = localAxis.x;
      offsetVec.x *= offset;
      offsetVec.y *= offset;
      offsetVec.z *= offset;

      // i端側⇒j端側
      for (const side of ["i", "j"]) {
        // 描画位置の設定と材端条件の取得
        let position;  // 描画位置用
        let freefix;  // 材端条件用
        if (side == "i") {
          position = {x:(iNode.x + offsetVec.x), y:(iNode.y + offsetVec.y), z:(iNode.z + offsetVec.z)};
          freefix = {x:joint.xi, y:joint.yi, z:joint.zi};
        } else {
          position = {x:(jNode.x - offsetVec.x), y:(jNode.y - offsetVec.y), z:(jNode.z - offsetVec.z)};
          freefix = {x:joint.xj, y:joint.yj, z:joint.zj};
        }

        // ローカルx⇒y⇒z軸まわり回転のピン接合
        for (const dir of ["x", "y", "z"]) {
          // 色と向きの設定
          let color;  // 色用
          let focalSpot;  // 向き用
          if (dir == "x") {
            if (freefix.x == 1) { continue; }  // 固定ならスキップ
            color = 0xFF0000;
            focalSpot = {x:(position.x + localAxis.x.x), y:(position.y + localAxis.x.y), z:(position.z + localAxis.x.z)};
          } else if (dir == "y") {
            if (freefix.y == 1) { continue; }  // 固定ならスキップ
            color = 0x00FF00;
            focalSpot = {x:(position.x + localAxis.y.x), y:(position.y + localAxis.y.y), z:(position.z + localAxis.y.z)};
          } else {
            if (freefix.z == 1) { continue; }  // 固定ならスキップ
            color = 0x0000FF;
            focalSpot = {x:(position.x + localAxis.z.x), y:(position.y + localAxis.z.y), z:(position.z + localAxis.z.z)};
          }
          // 描画オブジェクトの作成
          const pinObj = this.createJoint_base(position, color);
          pinObj.lookAt(focalSpot.x, focalSpot.y, focalSpot.z);
          pinObj.name = "joint" + joint.row.toString() + dir + side;
          this.jointList.push(pinObj);
          this.scene.add(pinObj);
        }
      }
  }

  // ドーナツ型描画オブジェクトの作成
  private createJoint_base(position, color){
    const pin_geometry = new THREE.TorusBufferGeometry(0.05, 0.005, 16, 64);
    const pin_material = new THREE.MeshBasicMaterial({color: color , side: THREE.DoubleSide});
    const pin = new THREE.Mesh(pin_geometry, pin_material);
    pin.position.set(position.x, position.y, position.z);
    return pin;
  }


  // データをクリアする
  public ClearData(): void {

    for (const mesh of this.jointList) {
      // 文字を削除する
      while (mesh.children.length > 0) {
        const object = mesh.children[0];
        object.parent.remove(object);
      }
      // オブジェクトを削除する
      this.scene.remove(mesh);
    }
    this.jointList = new Array();
  }

  // マウス位置とぶつかったオブジェクトを検出する
  public detectObject(raycaster: THREE.Raycaster , action: string): void {

    if (this.jointList.length === 0) {
      return; // 対象がなければ何もしない
    }

    // 交差しているオブジェクトを取得
    const intersects = raycaster.intersectObjects(this.jointList);
    if ( intersects.length <= 0 ){
      return;
    }

    switch (action) {
      case 'click':
        this.jointList.map(item => {
          if (intersects.length > 0 && item === intersects[0].object) {
            // 色を指定する
            if ( item.name === "0xFF0000" ){
              item.material['color'].setHex(0xff0000);
            }else if ( item.name === "0x00FF00" ){
              item.material['color'].setHex(0x00ff00);
            }else if ( item.name === "0x0000FF" ){
              item.material['color'].setHex(0x0000ff);
            }
            item.material['opacity'] = 1.00;  // 彩度 強
          }
        });
        break;

      case 'select':
          this.selectionItem = null;
          this.jointList.map(item => {
          if (intersects.length > 0 && item === intersects[0].object) {
            // 色を指定する
            if (item.name === "0xFF0000"){
              item.material['color'].setHex(0xff0000);
            }else if(item.name === "0x00FF00"){
              item.material['color'].setHex(0x00ff00);
            }else if(item.name === "0x0000FF"){
              item.material['color'].setHex(0x0000ff);
            }
            item.material['opacity'] = 1.00;  //彩度 強
            this.selectionItem = item;
          } else {
            // それ以外は彩度を下げる
            if (item.name === "0xFF0000"){
              item.material['color'].setHex(0xff0000);
            }else if(item.name === "0x00FF00"){
              item.material['color'].setHex(0x00ff00);
            }else if(item.name === "0x0000FF"){
              item.material['color'].setHex(0x0000ff);
            }
            item.material['opacity'] = 0.50;  //彩度 中
          }
        });
        break;

      case 'hover':
        this.jointList.map(item => {
          if (intersects.length > 0 && item === intersects[0].object) {
            // 色を指定する
            if (item.name === "0xFF0000"){
              item.material['color'].setHex(0xff0000);
            }else if(item.name === "0x00FF00"){
              item.material['color'].setHex(0x00ff00);
            }else if(item.name === "0x0000FF"){
              item.material['color'].setHex(0x0000ff);
            }
            item.material['opacity'] = 0.25;  //彩度 弱
          } else {
            if ( item === this.selectionItem ) {
              if (item.name === "0xFF0000"){
                item.material['color'].setHex(0xff0000);
              }else if(item.name === "0x00FF00"){
                item.material['color'].setHex(0x00ff00);
              }else if(item.name === "0x0000FF"){
                item.material['color'].setHex(0x0000ff);
              }
              item.material['opacity'] = 1.00;  //彩度 強
            } else {
              // それ以外は彩度を下げる
              if (item.name === "0xFF0000"){
                item.material['color'].setHex(0xff0000);
              }else if(item.name === "0x00FF00"){
                item.material['color'].setHex(0x00ff00);
              }else if(item.name === "0x0000FF"){
                item.material['color'].setHex(0x0000ff);
              }
              item.material['opacity'] = 0.50;  //彩度 中
            }
          }
        });
        break;

      default:
        return;
    }
    this.scene.render();
  }

}
