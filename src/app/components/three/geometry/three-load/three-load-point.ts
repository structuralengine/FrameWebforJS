import * as THREE from "three";

import {
  LoadData,
  MaxLoadDict,
  OffsetDict,
  OffsetDirection,
} from "./three-load-common";
import { ThreeLoadText3D } from "./three-load-text";

/** 節点荷重データ */
export class ThreeLoadPoint extends LoadData {
  /** 荷重の種別 */
  readonly loadType = "PointLoad";

  /** 荷重図形の拡大倍率 */
  readonly magnifier = 2.5; // 目立たないので少し大きめに描画

  /** この荷重と関連を持つ節点の節点番号一覧 */
  readonly correspondingNodeNoList: string[];
  /** この荷重と関連を持つ部材の部材番号一覧 */
  readonly correspondingMemberNoList: string[];

  /** 節点座標 */
  readonly position: THREE.Vector3;
  /** 方向 */
  readonly direction: string;
  /** 荷重値(kN) */
  readonly value: number;
  /** 荷重値の最大値(節点荷重と部材集中荷重) */
  readonly pMax: number;
  /** 荷重値の最大値(節点モーメントと部材集中モーメント) */
  readonly mMax: number = 0;
  /** 荷重値の最大値(部材分布荷重) */
  readonly wMax: number = 0;
  /** 荷重値の最大値(部材ねじりモーメント) */
  readonly rMax: number = 0;
  /** 荷重値の最大値(部材軸方向分布荷重) */
  readonly qMax: number = 0;
  /** 荷重描画方向を示す単位ベクトル */
  readonly uLoad: THREE.Vector3;
  /** 節点を起点とした場合の荷重描画方向を示す文字列 */
  readonly offsetDirection: OffsetDirection;
  /** 荷重テーブルの列情報(m=部材荷重、p=節点荷重) */
  readonly col: "m" | "p" = "p";
  /** 荷重テーブルの行番号 */
  readonly row: number;
  /** 荷重の積み上げ順を決める数値 */
  readonly rank = 20;

  /** ハイライト表示状態を示すフラグ */
  private isSelected: boolean = false;

  // this.children["group"].children["child"].children["arrow"] - 矢印
  // this.children["group"].children["child"].children["value"] - 荷重値

  static readonly colorRed = 0xff0000;
  static readonly colorGreen = 0x00ff00;
  static readonly colorBlue = 0x0000ff;
  static readonly colorPick = 0xafeeee;

  /**
   * 節点荷重の描画インスタンス生成
   * @param no 節点番号
   * @param mNoList この節点を一端とする部材の部材番号一覧
   * @param position 節点座標
   * @param direction 方向
   * @param value 荷重値(kN)
   * @param row 節点荷重データテーブルの行インデックス
   * @returns 節点荷重の描画インスタンス
   */
  constructor(
    no: string,
    mNoList: string[],
    position: THREE.Vector3,
    direction: string,
    value: number,
    row: number
  ) {
    super();

    this.correspondingNodeNoList = [no];
    this.correspondingMemberNoList = [...mNoList];

    this.position.copy(position);
    this.direction = direction;
    this.value = value;
    this.pMax = Math.abs(value);

    // 荷重線の向き(荷重値が負なら全体座標系プラス側に、正ならマイナス側に荷重線を描画する)
    const uLoad = new THREE.Vector3();
    let offsetdir: string;
    switch (direction) {
      case "tx":
        uLoad.set(1, 0, 0);
        offsetdir = "gx";
        break;
      case "ty":
        uLoad.set(0, 1, 0);
        offsetdir = "gy";
        break;
      case "tz":
        uLoad.set(0, 0, 1);
        offsetdir = "gz";
        break;
      default:
        throw new Error();
    }
    let pm: string;
    if (value < 0) {
      pm = "+";
    } else {
      pm = "-";
      uLoad.negate();
    }
    this.uLoad = uLoad;
    this.offsetDirection = `${offsetdir}${pm}` as OffsetDirection;

    this.row = row;

    this.name = `${this.loadType}-${row}-${direction}`;
  }

  /**
   * 荷重図の再配置
   * @param nodeOffsetDictMap key=節点番号、value=各接点のOffsetDict
   * @param memberOffsetDictMap key=部材番号、value=各部材のOffsetDict
   * @param maxLoadDict
   * @param scale 描画スケール
   * @param isSelected true=ハイライト表示、false=ハイライト表示解除、undefined=状態継続
   */
  relocate(
    nodeOffsetDictMap: Map<string, OffsetDict>,
    memberOffsetDictMap: Map<string, OffsetDict>,
    maxLoadDict: MaxLoadDict,
    scale: number,
    isSelected: boolean | undefined
  ): void {
    isSelected ??= this.isSelected;

    // この荷重に関連するOffsetDictの抽出
    const correspondingOffsetDictList1: OffsetDict[] = []; // offset決定用(節点＋部材)
    const correspondingOffsetDictList2: OffsetDict[] = []; // offset更新用(節点のみ)
    this.correspondingNodeNoList.forEach((no) => {
      const dict = nodeOffsetDictMap.get(no);
      correspondingOffsetDictList1.push(dict);
      correspondingOffsetDictList2.push(dict);
    });
    this.correspondingMemberNoList.forEach((no) => {
      correspondingOffsetDictList1.push(memberOffsetDictMap.get(no));
    });

    // この荷重に適用するoffsetの決定
    const offset = OffsetDict.getMax(
      this.offsetDirection,
      ...correspondingOffsetDictList1
    );

    // 矢印の向き(this.uLoadは矢印の向きではなくて矢印を描画する領域の向き)
    const dir = this.uLoad.clone().negate();
    // 矢印の長さ
    const length =
      (Math.abs(this.value) / maxLoadDict.pMax) * this.magnifier * scale;
    // 矢印の基点
    const origin = dir
      .clone()
      .negate()
      .multiplyScalar(offset + length);
    // 非選択時の矢印の色
    let arrowColor: number;
    switch (this.direction) {
      case "tx":
        arrowColor = ThreeLoadPoint.colorRed;
        break;
      case "ty":
        arrowColor = ThreeLoadPoint.colorGreen;
        break;
      case "tz":
        arrowColor = ThreeLoadPoint.colorBlue;
        break;
      default:
        throw new Error();
    }
    const color = isSelected ? ThreeLoadPoint.colorPick : arrowColor;

    // この荷重に関連するOffsetDictの更新
    correspondingOffsetDictList2.forEach((dict) =>
      dict.update(this.offsetDirection, offset + length)
    );

    const arrow = new THREE.ArrowHelper(dir, origin, length, color);
    arrow.name = "arrow";

    const child = new THREE.Group();
    child.add(arrow);
    child.name = "child";

    const old = this.getObjectByName("group");
    if (old) {
      this.remove(old);
    }

    const group = new THREE.Group();
    group.add(child);
    group.name = "group";

    this.add(group);

    // 荷重値の描画位置
    this.userData["textPos"] = origin; // 矢印の根元
    // 荷重値の描画方向(右)
    this.userData["vx"] = dir.clone().negate().normalize(); // 荷重の逆向き
    // 荷重線の描画方向(上)
    switch (this.direction) {
      case "tx":
        this.userData["vy"] = new THREE.Vector3(0, -1, 0); // y軸負方向
        break;
      case "ty":
      case "tz":
        this.userData["vy"] = new THREE.Vector3(-1, 0, 0); // x軸負方向
        break;
      default:
        throw new Error();
    }
    // 非選択時の矢印の色
    this.userData["arrowColor"] = arrowColor;

    this.isSelected = isSelected;

    this.setText(isSelected);
    // this.setColor(isSelected); 呼び出し不要
  }

  /**
   * 選択状態と非選択状態の切り替え
   * @param isSelected true=選択状態、false=非選択状態
   */
  highlight(isSelected: boolean): void {
    if (this.isSelected === isSelected) {
      return;
    }
    this.isSelected = isSelected;

    this.setText(isSelected);
    this.setColor(isSelected);
  }

  /**
   * 選択時は荷重値を描画し、非選択時は荷重値の描画をクリアする
   * @param isSelected true=選択状態、false=非選択状態
   */
  private setText(isSelected: boolean): void {
    const key = "value";

    // 一旦削除
    const child = this.getObjectByName("child");
    const old = child.getObjectByName(key);
    if (old) {
      child.remove(old);
    }

    if (!isSelected) {
      return;
    }

    const textString = this.value.toFixed(2) + " kN";
    const position = this.userData["textPos"] as THREE.Vector3;
    const vx = this.userData["vx"] as THREE.Vector3;
    const vy = this.userData["vy"] as THREE.Vector3;

    const text = new ThreeLoadText3D(textString, position, 0.1, {
      vx: vx,
      vy: vy,
      hAlign: "left",
      vAlign: "center",
    });
    text.name = key;

    child.add(text);
  }

  /**
   * 選択状態と非選択状態とで矢印の色を切り替える
   * @param isSelected true=選択状態、false=非選択状態
   */
  private setColor(isSelected: boolean): void {
    const color = isSelected
      ? ThreeLoadPoint.colorPick
      : (this.userData["arrowColor"] as number);

    const arrow = this.getObjectByName("arrow") as THREE.ArrowHelper;
    if (!arrow) {
      throw new Error();
    }

    arrow.setColor(color);
  }

  /**
   * 節点荷重の描画インスタンス生成
   * @param no 節点番号
   * @param mNoList この節点を一端とする部材の部材番号一覧
   * @param position 節点座標
   * @param direction 方向
   * @param value 荷重値(kN)
   * @param row 節点荷重データテーブルの行インデックス
   * @returns 節点荷重の描画インスタンス
   */
  static create(
    no: string,
    mNoList: string[],
    position: THREE.Vector3,
    direction: string,
    value: number,
    row: number
  ): ThreeLoadPoint | undefined {
    switch (direction) {
      case "tx":
      case "ty":
      case "tz":
        break;
      default:
        return undefined;
    }
    if (value === 0) {
      return undefined;
    }

    return new ThreeLoadPoint(no, mNoList, position, direction, value, row);
  }
}
