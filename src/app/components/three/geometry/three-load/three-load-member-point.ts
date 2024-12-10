import * as THREE from "three";

import {
  LoadData,
  LocalAxis,
  MaxLoadDict,
  OffsetDict,
  OffsetDirection,
} from "./three-load-common";
import { ThreeLoadDimension } from "./three-load-dimension";
import { ThreeLoadText3D } from "./three-load-text";

/** 部材集中荷重データ */
export class ThreeLoadMemberPoint extends LoadData {
  /** 荷重の種別 */
  readonly loadType: string = "PointMemberLoad";

  /** 荷重図形の拡大倍率 */
  readonly magnifier = 2.5; // 目立たないので少し大きめに描画

  /** この荷重と関連を持つ節点の節点番号一覧 */
  readonly correspondingNodeNoList: string[];
  /** この荷重と関連を持つ部材の部材番号一覧 */
  readonly correspondingMemberNoList: string[];

  /** i端節点の座標(基準点はthis.position) */
  readonly nodei: THREE.Vector3;
  /** j端節点の座標(基準点はthis.position) */
  readonly nodej: THREE.Vector3;
  /** マーク */
  readonly mark: number;
  /** 方向 */
  readonly direction: string;
  /** i端節点とL1点の間の距離(m) */
  readonly L1: number;
  /** L1点とL2点の間の距離(m) */
  readonly L: number;
  /** j端節点とL2点の間の距離(m) */
  readonly L2: number;
  /** L1点の荷重値(kN) */
  readonly P1: number;
  /** L2点の荷重値(kN) */
  readonly P2: number;
  /** 部材荷重系 */
  readonly localAxis: LocalAxis;
  /** L1点の座標 */
  readonly pL1: THREE.Vector3;
  /** L2点の座標 */
  readonly pL2: THREE.Vector3;
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
  /** L1点側の荷重描画方向を示す単位ベクトル */
  readonly uLoad: THREE.Vector3;
  /** 部材軸を起点とした場合の正値の荷重(軸方向の荷重は除く)の荷重描画方向を示す文字列 */
  readonly pOffsetDirection: OffsetDirection;
  /** 部材軸を起点とした場合の負値の荷重(または軸方向の荷重)の荷重描画方向を示す文字列 */
  readonly nOffsetDirection: OffsetDirection;
  /** 寸法線の描画方向を示す単位ベクトル */
  readonly uDimension: THREE.Vector3;
  /** 荷重テーブルの列情報(m=部材荷重、p=節点荷重) */
  readonly col: "m" | "p" = "m";
  /** 荷重テーブルの行番号 */
  readonly row: number;
  /** 方向(非選択時の描画色の決定に使用) */
  readonly originalDirection: string;
  /** 荷重の積み上げ順を決める数値 */
  readonly rank = 10;

  /** ハイライト表示状態を示すフラグ */
  private isSelected: boolean = false;

  // this.children["group"].children["child"].children["arrow1"] - L1点の荷重矢印
  // this.children["group"].children["child"].children["arrow2"] - L2点の荷重矢印
  // this.children["P1"] - 荷重値テキスト
  // this.children["P2"] - 荷重値テキスト
  // this.children["Dimention"]
  // this.children["Dimention"].children["Dimension1"]
  // this.children["Dimention"].children["Dimension1"].children["line"] - L1点の寸法補助線
  // this.children["Dimention"].children["Dimension1"].children["line"] - L1点とL2点の間の寸法線
  // this.children["Dimention"].children["Dimension1"].children["line"] - L2点の寸法補助線
  // this.children["Dimention"].children["Dimension1"].children["text"] - L1点とL2点の間の寸法テキスト
  // this.children["Dimention"].children["Dimension2"]
  // this.children["Dimention"].children["Dimension2"].children["line"] - i端節点の寸法補助線
  // this.children["Dimention"].children["Dimension2"].children["line"] - i端節点とL1点の間の寸法線
  // this.children["Dimention"].children["Dimension2"].children["text"] - i端節点とL1点お間の寸法テキスト
  // this.children["Dimention"].children["Dimension3"]
  // this.children["Dimention"].children["Dimension3"].children["line"] - j端節点の寸法補助線
  // this.children["Dimention"].children["Dimension3"].children["line"] - j端節点とL2点の間の寸法線
  // this.children["Dimention"].children["Dimension3"].children["text"] - j端節点とL2点の間の寸法テキスト

  static readonly lineColorRed = 0xff0000;
  static readonly lineColorGreen = 0x00ff00;
  static readonly lineColorBlue = 0x0000ff;
  static readonly lineColorSelected = 0xafeeee;

  /**
   * 部材集中荷重データインスタンスの生成
   * @param mNo 部材番号
   * @param niNo i端節点の節点番号
   * @param njNo j端節点の節点番号
   * @param nodei i端節点の座標
   * @param nodej j端節点の座標
   * @param mark マーク
   * @param direction 方向
   * @param L1 i端節点とL1点の間の距離(m)
   * @param L2 i端節点とL2点の間の距離(m)
   * @param P1 L1点の荷重値(kN)
   * @param P2 L2点の荷重値(kN)
   * @param localAxis 部材座標系
   * @param row 部材荷重データテーブルの行インデックス
   * @param originalDirection 方向(非選択時の描画色の決定に使用)
   */
  constructor(
    mNo: string,
    niNo: string,
    njNo: string,
    nodei: THREE.Vector3,
    nodej: THREE.Vector3,
    mark: number,
    direction: string,
    L1: number,
    L2: number,
    P1: number,
    P2: number,
    localAxis: LocalAxis,
    row: number,
    originalDirection: string
  ) {
    super();

    this.correspondingNodeNoList = [niNo, njNo];
    this.correspondingMemberNoList = [mNo];

    // 部材長
    const len = nodei.distanceTo(nodej);

    // 部材の基準点
    const pBase = nodei.clone().lerp(nodej, 0.5); // nodeiとnodejの中点
    // i端節点とj端節点の座標の基準点を原点からpBaseに移動
    nodei = nodei.clone().sub(pBase);
    nodej = nodej.clone().sub(pBase);

    // 「i端 L1 L2 j端」の順に並び替え
    if (L1 > L2) {
      const tL1 = L1;
      L1 = L2;
      L2 = tL1;
      const tP1 = P1;
      P1 = P2;
      P2 = tP1;
    }
    // L2をj端からの距離に変更
    L2 = len - L2;

    this.nodei = nodei;
    this.nodej = nodej;
    this.mark = mark;
    this.direction = direction;
    this.L1 = L1;
    this.L = len - L1 - L2;
    this.L2 = L2;
    this.P1 = P1;
    this.P2 = P2;
    this.localAxis = localAxis.clone();
    this.pL1 = nodei.clone().lerp(nodej, L1 / len);
    this.pL2 = nodej.clone().lerp(nodei, L2 / len);
    this.pMax = Math.max(Math.abs(P1), Math.abs(P2));

    const uLoad = new THREE.Vector3();
    let offsetdir: string;
    switch (direction) {
      case "x":
        uLoad.copy(localAxis.y).negate(); // CAUTION: 荷重の向きではなくて、荷重線を描画する向き
        offsetdir = "ly";
        break;
      case "y":
        uLoad.copy(localAxis.y);
        offsetdir = "ly";
        break;
      case "z":
        uLoad.copy(localAxis.z);
        offsetdir = "lz";
        break;
      case "gx":
        uLoad.set(1, 0, 0);
        offsetdir = "gx";
        break;
      case "gy":
        uLoad.set(0, 1, 0);
        offsetdir = "gy";
        break;
      case "gz":
        uLoad.set(0, 0, 1);
        offsetdir = "gz";
        break;
      default:
        throw new Error();
    }
    this.uLoad = uLoad.negate();

    this.pOffsetDirection = `${offsetdir}-` as OffsetDirection;
    this.nOffsetDirection = `${offsetdir}+` as OffsetDirection;

    const vij = nodej.clone().sub(nodei); // i端節点からj端節点に向かうベクトル
    const vOrth = vij.clone().cross(uLoad); // 部材軸と荷重描画方向とに直交するベクトル
    // const uDim = vij.clone().cross(vOrth).normalize(); // 部材軸と直交し、かつ部材描画方向と逆向きの単位ベクトル
    this.uDimension = vOrth.normalize(); // uDim; // @TODO: 荷重描画面と寸法線関連が重なって見苦しいので直交させておく・・・

    this.row = row;
    this.originalDirection = originalDirection;

    this.name = `${this.loadType}-${row}-m`;
    this.position.copy(pBase);
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
    const oldGroup = this.getObjectByName("group");
    if (oldGroup) {
      this.remove(oldGroup);
    }

    isSelected ??= this.isSelected;

    const isAxial = this.direction === "x";
    const { pL1a, pL1b, pL2b, pL2a } = this.getLoadPoints(
      nodeOffsetDictMap,
      memberOffsetDictMap,
      maxLoadDict.pMax,
      scale,
      isAxial
    );
    const lineColor = this.getLoadColor(false); // 非選択時の色

    const child = new THREE.Group();
    child.name = "child";

    if (this.P1 !== 0) {
      const arrow1 = this.getLoadArrow(pL1a, pL1b, lineColor, "arrow1");
      child.add(arrow1);
    }
    if (this.P2 !== 0) {
      const arrow2 = this.getLoadArrow(pL2a, pL2b, lineColor, "arrow2");
      child.add(arrow2);
    }

    const group = new THREE.Group();
    group.add(child);
    group.name = "group";

    this.add(group);

    // 非選択時の荷重面の色
    this.userData["lineColor"] = lineColor;
    // 荷重値の描画位置
    this.userData["P1Pos"] = pL1b;
    this.userData["P2Pos"] = pL2b;
    // 荷重値の描画方向(右)
    this.userData["vx1"] = pL1b.clone().sub(pL1a).normalize(); // L1点の荷重の逆向き
    this.userData["vx2"] = pL2b.clone().sub(pL2a).normalize(); // L2点の荷重の逆向き
    // 荷重線の描画方向(上)
    this.userData["vy"] = this.nodei.clone().sub(this.nodej).normalize(); // j端からi端に向かう向き
    // 寸法線関連の描画用データ
    this.userData["scale"] = scale;

    this.isSelected = isSelected;

    this.setColor(isSelected); // 非選択時の色で描画しているので呼び出し必須
    this.setText(isSelected);
    this.setDim(isSelected);
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

    this.setColor(isSelected);
    this.setText(isSelected);
    this.setDim(isSelected);
  }

  private getLoadPoints(
    nodeOffsetDictMap: Map<string, OffsetDict>,
    memberOffsetDictMap: Map<string, OffsetDict>,
    wMax: number,
    scale: number,
    isAxial: boolean
  ): {
    pL1a: THREE.Vector3;
    pL1b: THREE.Vector3;
    pL2b: THREE.Vector3;
    pL2a: THREE.Vector3;
  } {
    // この荷重に関連するOffsetDictの抽出
    const correspondingOffsetDictList: OffsetDict[] = [];
    this.correspondingMemberNoList.forEach((no) => {
      correspondingOffsetDictList.push(memberOffsetDictMap.get(no));
    });

    // 荷重の大きさの正規化
    const coef1 = (this.P1 / wMax) * this.magnifier * scale;
    const coef2 = (this.P2 / wMax) * this.magnifier * scale;

    // L1点の荷重描画開始点の座標
    const pL1a = new THREE.Vector3();
    // L1点の荷重頂点の座標
    const pL1b = new THREE.Vector3();
    // L2点の荷重描画開始点の座標
    const pL2a = new THREE.Vector3();
    // L2点の荷重頂点の座標
    const pL2b = new THREE.Vector3();

    if (isAxial) {
      // 軸方向の場合は部材座標系のy軸プラス側に矢印を描画する
      const offsetDirection = this.nOffsetDirection;

      // この荷重に適用するoffsetの決定
      const offset = OffsetDict.getMax(
        offsetDirection,
        ...correspondingOffsetDictList
      );

      const gap = 0.3 * scale; // 部材軸との間隙の大きさ

      pL1a.copy(
        this.pL1.clone().add(this.uLoad.clone().multiplyScalar(offset + gap))
      );
      pL2a.copy(
        this.pL2.clone().add(this.uLoad.clone().multiplyScalar(offset + gap))
      );

      pL1b.copy(
        pL1a.clone().sub(this.localAxis.x.clone().multiplyScalar(coef1))
      );
      pL2b.copy(
        pL2a.clone().sub(this.localAxis.x.clone().multiplyScalar(coef2))
      );

      // 荷重の外側の間隙の大きさ
      const overGap = 0.1 * scale;

      // この荷重に関連するOffsetDictの更新(節点の情報も併せて更新する)
      this.correspondingNodeNoList.forEach((no) =>
        correspondingOffsetDictList.push(nodeOffsetDictMap.get(no))
      );
      correspondingOffsetDictList.forEach((dict) =>
        dict.update(offsetDirection, offset + gap + overGap)
      );
    } else {
      // 正値の荷重の描画方向のoffset
      const pOffset = OffsetDict.getMax(
        this.pOffsetDirection,
        ...correspondingOffsetDictList
      );
      // 負値の荷重の描画方向のoffset
      const nOffset = OffsetDict.getMax(
        this.nOffsetDirection,
        ...correspondingOffsetDictList
      );

      // この荷重に適用するoffsetの決定
      let offset: number;
      const { aMax, aMin } =
        Math.abs(coef1) < Math.abs(coef2)
          ? { aMax: coef2, aMin: coef1 }
          : { aMax: coef1, aMin: coef2 };
      if (aMax < 0) {
        if (pOffset === 0 && nOffset === 0) {
          offset = 0;
        } else {
          offset = -nOffset - Math.max(0, aMin);
        }
      } else {
        if (pOffset === 0 && nOffset === 0) {
          offset = 0;
        } else {
          offset = pOffset - Math.min(0, aMin);
        }
      }

      pL1a.copy(
        this.pL1.clone().add(this.uLoad.clone().multiplyScalar(offset))
      );
      pL2a.copy(
        this.pL2.clone().add(this.uLoad.clone().multiplyScalar(offset))
      );

      pL1b.copy(pL1a.clone().add(this.uLoad.clone().multiplyScalar(coef1)));
      pL2b.copy(pL2a.clone().add(this.uLoad.clone().multiplyScalar(coef2)));

      // この荷重に関連するOffsetDictの更新(節点の情報も併せて更新する)
      this.correspondingNodeNoList.forEach((no) =>
        correspondingOffsetDictList.push(nodeOffsetDictMap.get(no))
      );
      [offset + coef1, offset + coef2].forEach((nextOffset) => {
        if (nextOffset < 0) {
          correspondingOffsetDictList.forEach((dict) =>
            dict.update(this.nOffsetDirection, -nextOffset)
          );
        } else {
          correspondingOffsetDictList.forEach((dict) =>
            dict.update(this.pOffsetDirection, nextOffset)
          );
        }
      });
    }

    return { pL1a, pL1b, pL2b, pL2a };
  }

  private getLoadColor(isSelected: boolean): number {
    if (isSelected) {
      return ThreeLoadMemberPoint.lineColorSelected;
    } else {
      switch (this.originalDirection) {
        case "x":
        case "gx":
          return ThreeLoadMemberPoint.lineColorRed;
        case "y":
        case "gy":
          return ThreeLoadMemberPoint.lineColorGreen;
        case "z":
        case "gz":
          return ThreeLoadMemberPoint.lineColorBlue;
        default:
          throw new Error();
      }
    }
  }

  private getLoadArrow(
    pa: THREE.Vector3,
    pb: THREE.Vector3,
    lineColor: number,
    name: string
  ): THREE.ArrowHelper {
    const dir = pa.clone().sub(pb).normalize();
    const origin = pb;
    const length = pa.distanceTo(pb);
    const color = lineColor;

    const arrow = new THREE.ArrowHelper(dir, origin, length, color);
    arrow.name = name;

    return arrow;
  }

  /**
   * 選択時と非選択時の寸法面の色の切り替え
   * @param isSelected true=選択状態、false=非選択状態
   */
  private setColor(isSelected: boolean): void {
    ["arrow1", "arrow2"].forEach((name) => {
      const arrow1 = this.getObjectByName(name) as THREE.ArrowHelper;
      if (arrow1) {
        const color = isSelected
          ? ThreeLoadMemberPoint.lineColorSelected
          : (this.userData["lineColor"] as number);
        arrow1.setColor(color);
      }
    });
  }

  /**
   * 選択時は荷重値を描画し、非選択時は荷重値の描画をクリアする
   * @param isSelected true=選択状態、false=非選択状態
   */
  private setText(isSelected: boolean): void {
    // 一旦削除
    ["P1", "P2"].forEach((key) => {
      const old = this.getObjectByName(key);
      if (old) {
        this.remove(old);
      }
    });

    if (!isSelected) {
      return;
    }

    const P1 = this.P1;
    const P2 = this.P2;
    const P1Pos = this.userData["P1Pos"] as THREE.Vector3;
    const P2Pos = this.userData["P2Pos"] as THREE.Vector3;
    const vx1 = this.userData["vx1"] as THREE.Vector3;
    const vx2 = this.userData["vx2"] as THREE.Vector3;
    const vy = this.userData["vy"] as THREE.Vector3;

    [
      { key: "P1", value: P1, pos: P1Pos, vx: vx1 },
      { key: "P2", value: P2, pos: P2Pos, vx: vx2 },
    ].forEach(({ key, value, pos, vx }) => {
      value = Math.round(value * 100) / 100;
      if (value === 0) {
        return;
      }
      const textString = value.toFixed(2) + " kN/m";
      const text = new ThreeLoadText3D(textString, pos, 0.1, {
        vx: vx,
        vy: vy,
        hAlign: "left",
        vAlign: "center",
      });
      text.name = key;

      this.add(text);
    });
  }

  /**
   * 選択時は寸法線関連を描画し、非選択時はクリアする
   * @param isSelected true=選択状態、false=非選択状態
   */
  private setDim(isSelected: boolean): void {
    // 一旦削除
    const old = this.getObjectByName("Dimension");
    if (old) {
      this.remove(old);
    }

    if (!isSelected) {
      return;
    }

    const scale = this.userData["scale"] as number;

    // const offset: number = (group.offset ?? 0) * scale; // @FIXME: 現状はundefinedで固定
    const offset = 0;
    const L1 = this.L1;
    const L = this.L;
    const L2 = this.L2;

    const size = 1 * scale; // 寸法補助線の長さ(でっぱりを除く)
    const protrude = 0.03 * scale; // 寸法補助線のでっぱりの長さ

    const dim = new THREE.Group();

    // L1点の座標
    const pL1 = this.pL1;
    // L2点の座標
    const pL2 = this.pL2;
    // 部材軸に直交しており、かつ荷重面に平行な単位ベクトル(寸法補助線の向き)
    const uDimension = this.uDimension;

    // 寸法補助線の始点(L1点)
    const pL1a = pL1.clone().add(uDimension.clone().multiplyScalar(offset));
    // 寸法線の始点(L1点)
    const pL1b = pL1a.clone().add(uDimension.clone().multiplyScalar(size));
    // 寸法補助線の終点(L1点)
    const pL1c = pL1b.clone().add(uDimension.clone().multiplyScalar(protrude));

    // 寸法補助線の始点(L2点)
    const pL2a = pL2.clone().add(uDimension.clone().multiplyScalar(offset));
    // 寸法線の始点(L2点)
    const pL2b = pL2a.clone().add(uDimension.clone().multiplyScalar(size));
    // 寸法補助線の終点(L2点)
    const pL2c = pL2b.clone().add(uDimension.clone().multiplyScalar(protrude));

    const pp: THREE.Vector3[][] = [
      [pL1a, pL1c], // 寸法補助線(L1点)
      [pL2a, pL2c], // 寸法補助線(L2点)
      [pL1b, pL2b], // 寸法線
    ];
    const dim1 = new ThreeLoadDimension(pp, L.toFixed(3));
    dim1.visible = true;
    dim1.name = "Dimentsion1";
    dim.add(dim1);

    if (L1 > 0) {
      // 部材i端の座標
      const pi = this.nodei;

      // 寸法補助線の始点(i端)
      const pia = pi.clone().add(uDimension.clone().multiplyScalar(offset));
      // 寸法線の始点(i端)
      const pib = pia.clone().add(uDimension.clone().multiplyScalar(size));
      // 寸法補助線の終点(i端)
      const pic = pib.clone().add(uDimension.clone().multiplyScalar(protrude));

      const pp: THREE.Vector3[][] = [
        [pia, pic], // 寸法補助線(i端)
        [pib, pL1b], // 寸法線
      ];
      const dim2 = new ThreeLoadDimension(pp, L1.toFixed(3));
      dim2.visible = true;
      dim2.name = "Dimentsion2";
      dim.add(dim2);
    }

    if (L2 > 0) {
      // 部材j端の座標
      const pj: THREE.Vector3 = this.nodej;

      // 寸法補助線の始点(j端)
      const pja = pj.clone().add(uDimension.clone().multiplyScalar(offset));
      // 寸法線の始点(j端)
      const pjb = pja.clone().add(uDimension.clone().multiplyScalar(size));
      // 寸法補助線の終点(j端)
      const pjc = pjb.clone().add(uDimension.clone().multiplyScalar(protrude));

      const pp: THREE.Vector3[][] = [
        [pja, pjc], // 寸法補助線(j端)
        [pL2b, pjb], // 寸法線
      ];
      const dim3 = new ThreeLoadDimension(pp, L2.toFixed(3));
      dim3.visible = true;
      dim3.name = "Dimentsion3";
      dim.add(dim3);
    }

    // 登録
    dim.name = "Dimension";

    this.add(dim);
  }

  /**
   * 部材集中荷重の描画インスタンス生成
   * @param mNo 部材番号
   * @param niNo i端節点の節点番号
   * @param njNo j端節点の節点番号
   * @param nodei i端節点の座標
   * @param nodej j端節点の座標
   * @param mark マーク
   * @param direction 方向
   * @param L1 i端節点からL1点までの距離(m)
   * @param L2 i端節点からL2点までの距離(m)
   * @param P1 L1点の荷重値(kN)
   * @param P2 L2点の荷重値(kN)
   * @param localAxis 部材座標系
   * @param row 部材荷重データテーブルの行インデックス
   * @param originalDirection 方向(非選択時の描画色の決定に使用)
   * @returns 部材集中荷重の描画インスタンス。対象外の荷重の場合はundefined
   */
  static create(
    mNo: string,
    niNo: string,
    njNo: string,
    nodei: THREE.Vector3,
    nodej: THREE.Vector3,
    mark: number,
    direction: string,
    L1: number | undefined,
    L2: number | undefined,
    P1: number | undefined,
    P2: number | undefined,
    localAxis: LocalAxis,
    row: number,
    originalDirection: string
  ): ThreeLoadMemberPoint | undefined {
    switch (mark) {
      case 1:
        break;
      default:
        return undefined;
    }
    switch (direction) {
      case "x":
      case "y":
      case "z":
      case "gx":
      case "gy":
      case "gz":
        break;
      default:
        return undefined;
    }

    const L = nodei.distanceTo(nodej);
    if (L === 0) {
      return undefined;
    }

    const xL1 = L1 ?? 0;
    const xL2 = L2 ?? 0;
    if (xL1 < 0 || xL2 < 0 || L < xL1 || L < xL2) {
      return undefined;
    }

    const xP1 = P1 ?? 0;
    const xP2 = P2 ?? 0;
    if (xP1 === 0 && xP2 === 0) {
      return undefined;
    }

    return new ThreeLoadMemberPoint(
      mNo,
      niNo,
      njNo,
      nodei,
      nodej,
      mark,
      direction,
      xL1,
      xL2,
      xP1,
      xP2,
      localAxis,
      row,
      originalDirection
    );
  }
}
