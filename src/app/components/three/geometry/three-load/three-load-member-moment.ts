import * as THREE from "three";

import {
  LoadData,
  LocalAxis,
  MaxLoadDict,
  OffsetDict,
  OffsetDirection,
} from "./three-load-common";
import { ThreeLoadMoment } from "./three-load-moment";
import { ThreeLoadDimension } from "./three-load-dimension";

/** 部材集中モーメント荷重データ */
export class ThreeLoadMemberMoment extends LoadData {
  /** 荷重の種別 */
  readonly loadType: string = "MomentMemberLoad";

  /** 荷重図形の拡大倍率 */
  readonly magnifier = 1;

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
  readonly pMax: number = 0;
  /** 荷重値の最大値(節点モーメントと部材集中モーメント) */
  readonly mMax: number;
  /** 荷重値の最大値(部材分布荷重) */
  readonly wMax: number = 0;
  /** 荷重値の最大値(部材ねじりモーメント) */
  readonly rMax: number = 0;
  /** 荷重値の最大値(部材軸方向分布荷重) */
  readonly qMax: number = 0;
  /** 部材軸を起点とした場合の荷重描画方向を示す文字列 */
  readonly offsetDirection: OffsetDirection;
  /** 寸法線の描画方向を示す単位ベクトル */
  readonly uDimension: THREE.Vector3;
  /** 荷重テーブルの列情報(m=部材荷重、p=節点荷重) */
  readonly col: "m" | "p" = "m";
  /** 荷重テーブルの行番号 */
  readonly row: number;
  /** 方向(非選択時の描画色の決定に使用) */
  readonly originalDirection: string;
  /** 荷重の積み上げ順を決める数値 */
  readonly rank = 0;

  /** ハイライト表示状態を示すフラグ */
  private isSelected: boolean = false;

  // this.children["group"].children["arrow1"].children["child"].children["arrow"] - L1点の荷重矢印(矢尻)
  // this.children["group"].children["arrow1"].children["child"].children["line"] - L1点の荷重矢印(矢柄)
  // this.children["group"].children["arrow2"].children["child"].children["arrow"] - L2点の荷重矢印(矢尻)
  // this.children["group"].children["arrow2"].children["child"].children["line"] - L2点の荷重矢印(矢柄)
  // (荷重値テキストの描画は未実装)
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

  private static readonly arrowMaterialRed = new THREE.MeshBasicMaterial({
    color: 0xff0000,
  });
  private static readonly arrowMaterialGreen = new THREE.MeshBasicMaterial({
    color: 0x00ff00,
  });
  private static readonly arrowMaterialBlue = new THREE.MeshBasicMaterial({
    color: 0x0000ff,
  });
  private static readonly arrowMaterialPick = new THREE.MeshBasicMaterial({
    color: 0xafeeee,
  });
  private static readonly lineMaterialRed = new THREE.LineBasicMaterial({
    color: 0xff0000,
  });
  private static readonly lineMaterialGreen = new THREE.LineBasicMaterial({
    color: 0x00ff00,
  });
  private static readonly lineMaterialBlue = new THREE.LineBasicMaterial({
    color: 0x0000ff,
  });
  private static readonly lineMaterialPick = new THREE.LineBasicMaterial({
    color: 0xafeeee,
  });

  /**
   * 部材集中モーメント荷重データインスタンスの生成
   * @param mNo 部材番号
   * @param niNo i端節点の節点番号
   * @param njNo j端節点の節点番号
   * @param nodei i端節点の座標
   * @param nodej j端節点の座標
   * @param mark マーク
   * @param direction 方向
   * @param L1 i端節点とL1点の間の距離(m)
   * @param L2 i端節点とL2点の間の距離(m)
   * @param P1 L1点の荷重値(kNm)
   * @param P2 L2点の荷重値(kNm)
   * @param localAxis 部材座標系
   * @param originalDirection 方向(非選択時の描画色の決定に使用)
   * @param row 部材荷重データテーブルの行インデックス
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
    this.mMax = Math.max(Math.abs(P1), Math.abs(P2));

    let offsetdir: string;
    switch (direction) {
      case "x":
        offsetdir = "rlx";
        break;
      case "y":
        offsetdir = "rly";
        break;
      case "z":
        offsetdir = "rlz";
        break;
      case "gx":
        offsetdir = "rgx";
        break;
      case "gy":
        offsetdir = "rgy";
        break;
      case "gz":
        offsetdir = "rgz";
        break;
      default:
        throw new Error();
    }
    this.offsetDirection = offsetdir as OffsetDirection;

    // 寸法線関連を描画する向きは、部材座標系y軸のプラス側
    this.uDimension = localAxis.y.clone().negate();

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
    // この荷重に関連するOffsetDictの抽出
    const correspondingOffsetDictList: OffsetDict[] = [];
    this.correspondingMemberNoList.forEach((no) => {
      correspondingOffsetDictList.push(memberOffsetDictMap.get(no));
    });

    const old = this.getObjectByName("group");
    if (old) {
      this.remove(old);
    }

    isSelected ??= this.isSelected;

    const { arrowColor, lineColor } = this.getColor();

    const group = new THREE.Group();
    group.name = "group";

    let largerRadius = 0;
    [
      { value: this.P1, pos: this.pL1, name: "arrow1" },
      { value: this.P2, pos: this.pL2, name: "arrow2" },
    ].forEach(({ value, pos, name }) => {
      const radius =
        (Math.abs(value) / maxLoadDict.mMax) * this.magnifier * scale;

      const arrow = ThreeLoadMoment.getArrow(
        this.direction,
        value,
        radius,
        arrowColor,
        lineColor,
        this.localAxis
      );
      arrow.name = name;

      arrow.position.copy(pos);

      group.add(arrow);

      largerRadius = Math.max(largerRadius, radius);
    });

    // この荷重に関連するOffsetDictの更新(節点の情報も併せて更新する)
    this.correspondingNodeNoList.forEach((no) =>
      correspondingOffsetDictList.push(nodeOffsetDictMap.get(no))
    );
    correspondingOffsetDictList.forEach((dict) =>
      dict.update(this.offsetDirection, largerRadius)
    );

    this.add(group);

    // 非選択時の矢印と本体の色
    this.userData["arrowColor"] = arrowColor;
    this.userData["lineColor"] = lineColor;
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

  private getColor(): {
    arrowColor: THREE.MeshBasicMaterial;
    lineColor: THREE.LineBasicMaterial;
  } {
    const arrowColor = new THREE.MeshBasicMaterial();
    const lineColor = new THREE.LineBasicMaterial();
    switch (this.originalDirection) {
      case "x":
      case "gx":
        arrowColor.copy(ThreeLoadMemberMoment.arrowMaterialRed);
        lineColor.copy(ThreeLoadMemberMoment.lineMaterialRed);
        break;
      case "y":
      case "gy":
        arrowColor.copy(ThreeLoadMemberMoment.arrowMaterialGreen);
        lineColor.copy(ThreeLoadMemberMoment.lineMaterialGreen);
        break;
      case "z":
      case "gz":
        arrowColor.copy(ThreeLoadMemberMoment.arrowMaterialBlue);
        lineColor.copy(ThreeLoadMemberMoment.lineMaterialBlue);
        break;
      default:
        throw new Error();
    }
    return { arrowColor, lineColor };
  }

  /**
   * 選択状態と非選択状態とで矢印の色を切り替える
   * @param isSelected true=選択状態、false=非選択状態
   */
  private setColor(isSelected: boolean): void {
    ["arrow1", "arrow2"].forEach((name) => {
      const group = this.getObjectByName(name);
      if (group) {
        const arrowColor = isSelected
          ? ThreeLoadMemberMoment.arrowMaterialPick
          : (this.userData["arrowColor"] as THREE.MeshBasicMaterial);
        const arrow = group.getObjectByName("arrow") as THREE.Mesh;
        if (!arrow) {
          throw new Error();
        }
        arrow.material = arrowColor;

        const lineColor = isSelected
          ? ThreeLoadMemberMoment.lineMaterialPick
          : (this.userData["lineColor"] as THREE.LineBasicMaterial);
        const line = group.getObjectByName("line") as THREE.Line<
          THREE.BufferGeometry,
          THREE.LineBasicMaterial
        >;
        if (!line) {
          throw new Error();
        }
        line.material = lineColor;
      }
    });
  }

  /**
   * 選択時は荷重値を描画し、非選択時は荷重値の描画をクリアする
   * @param isSelected true=選択状態、false=非選択状態
   */
  private setText(isSelected: boolean): void {
    // @TODO: オリジナルのFrameWebに荷重値の描画処理が定義されていないので、とりあえず割愛
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
   * 部材集中モーメント荷重の描画インスタンス生成
   * @param mNo 部材番号
   * @param niNo i端節点の節点番号
   * @param njNo j端節点の節点番号
   * @param nodei i端節点の座標
   * @param nodej j端節点の座標
   * @param mark マーク
   * @param direction 方向
   * @param L1 i端節点からL1点までの距離(m)
   * @param L2 i端節点からL2点までの距離(m)
   * @param P1 L1点の荷重値(kNm)
   * @param P2 L2点の荷重値(kNm)
   * @param localAxis 部材座標系
   * @param row 部材荷重データテーブルの行インデックス
   * @param originalDirection 方向(非選択時の描画色の決定に使用)
   * @returns 部材集中モーメント荷重の描画インスタンス。対象外の荷重の場合はundefined
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
  ): ThreeLoadMemberMoment | undefined {
    switch (mark) {
      case 11:
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

    return new ThreeLoadMemberMoment(
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
