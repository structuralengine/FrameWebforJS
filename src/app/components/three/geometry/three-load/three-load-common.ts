import * as THREE from "three";

/** 部材座標系 */
export class LocalAxis {
  readonly x: THREE.Vector3;
  readonly y: THREE.Vector3;
  readonly z: THREE.Vector3;

  /**
   * @param data 部材座標系
   */
  constructor(data: { x: THREE.Vector3; y: THREE.Vector3; z: THREE.Vector3 }) {
    this.x = data.x;
    this.y = data.y;
    this.z = data.z;
  }

  /** 自身を複製する(ディープクローン) */
  clone(): LocalAxis {
    return new LocalAxis({
      x: this.x.clone(),
      y: this.y.clone(),
      z: this.z.clone(),
    });
  }
}

const offsetDirectionList = [
  "rlx", // 11x
  "rly", // 11y
  "rlz", // 11z
  "rgx", // rx, 11gx
  "rgy", // ry, 11gy
  "rgz", // rz, 11gz
  "ly+", // 1y, 2y, 1x
  "ly-", // 1y, 2y, 9
  "lz+", // 1z, 2z
  "lz-", // 1z, 2z
  "gx+", // tx, 1gx, 2gx
  "gx-", // tx, 1gx, 2gx
  "gy+", // ty, 1gy, 2gy
  "gy-", // ty, 1gy, 2gy
  "gz+", // tz, 1gz, 2gz
  "gz-", // tz, 1gz, 2gz
  "R", // 2r
] as const;
/** オフセットの向き */
export type OffsetDirection = (typeof offsetDirectionList)[number];

/** 節点または部材のオフセットの向き別オフセット情報 */
export class OffsetDict {
  /** 部材座標系(部材用) */
  private localAxis: LocalAxis | undefined;
  /** オブセットの向き別オフセット情報 */
  private dict: {
    [key: string]: number;
  } = {};

  /**
   * @param localAxis 部材座標系(部材用)
   */
  constructor(localAxis: LocalAxis | undefined = undefined) {
    this.localAxis = localAxis;

    this.reset();
  }

  /** オフセット情報の初期化 */
  reset(): void {
    offsetDirectionList.forEach((key) => (this.dict[key] = 0));
  }

  private getParam_rlx(): Map<string, number> {
    if (!this.localAxis) {
      return new Map<string, number>();
    }
    const result = new Map<string, number>([
      ["ly+", 1],
      ["ly-", 1],
      ["lz+", 1],
      ["lz-", 1],
    ]);
    [
      { gvec: new THREE.Vector3(1, 0, 0), gdir: "gx" },
      { gvec: new THREE.Vector3(0, 1, 0), gdir: "gy" },
      { gvec: new THREE.Vector3(0, 0, 1), gdir: "gz" },
    ].forEach(({ gvec, gdir }) => {
      const angle = this.localAxis.x.angleTo(gvec);
      const csc = 1 / Math.abs(Math.sin(angle));
      if (isFinite(csc)) {
        result.set(`${gdir}+`, csc);
        result.set(`${gdir}-`, csc);
      }
    });
    return result;
  }
  private getParam_rly(
    params:
      | { ldirs: OffsetDirection[]; lvec: THREE.Vector3 }
      | undefined = undefined
  ): Map<string, number> {
    if (!this.localAxis) {
      return new Map<string, number>();
    }
    params ??= { ldirs: ["lz+", "lz-"], lvec: this.localAxis.y };
    const result = new Map<string, number>();
    params.ldirs.forEach((ldir) => result.set(ldir, 1));
    [
      {
        gvec: new THREE.Vector3(1, 0, 0),
        gdir: "gx",
      },
      {
        gvec: new THREE.Vector3(0, 1, 0),
        gdir: "gy",
      },
      {
        gvec: new THREE.Vector3(0, 0, 1),
        gdir: "gz",
      },
    ].forEach(({ gvec, gdir }) => {
      if (params.lvec.dot(gvec) === 0) {
        const angle = this.localAxis.x.angleTo(gvec);
        const csc = 1 / Math.abs(Math.sin(angle));
        if (isFinite(csc)) {
          result.set(`${gdir}+`, csc);
          result.set(`${gdir}-`, csc);
        }
      }
    });
    return result;
  }
  private getParam_rlz(): Map<string, number> {
    if (!this.localAxis) {
      return new Map<string, number>();
    }
    return this.getParam_rly({ ldirs: ["ly+", "ly-"], lvec: this.localAxis.z });
  }
  private getParam_rgx(
    params:
      | { gdirs: OffsetDirection[]; gvec: THREE.Vector3 }
      | undefined = undefined
  ): Map<string, number> {
    params ??= {
      gdirs: ["gy+", "gy-", "gz+", "gz-"],
      gvec: new THREE.Vector3(1, 0, 0),
    };
    const result = new Map<string, number>();
    params.gdirs.forEach((gdir) => result.set(gdir, 1));
    if (this.localAxis) {
      [
        { lvec: this.localAxis.y, ldir: "ly", lxlvecNormal: this.localAxis.z },
        { lvec: this.localAxis.z, ldir: "lz", lxlvecNormal: this.localAxis.y },
      ].forEach(({ lvec, ldir, lxlvecNormal }) => {
        const cross = lxlvecNormal.clone().cross(params.gvec);
        const angle = cross.angleTo(lvec);
        const cos = Math.abs(Math.cos(angle));
        if (cos !== 0) {
          result.set(`${ldir}+`, cos);
          result.set(`${ldir}-`, cos);
        }
      });
    }
    return result;
  }
  private getParam_rgy(): Map<string, number> {
    return this.getParam_rgx({
      gdirs: ["gx+", "gx-", "gz+", "gz-"],
      gvec: new THREE.Vector3(0, 1, 0),
    });
  }
  private getParam_rgz(): Map<string, number> {
    return this.getParam_rgx({
      gdirs: ["gx+", "gx-", "gy+", "gy-"],
      gvec: new THREE.Vector3(0, 0, 1),
    });
  }
  private getParam_ly(
    pm: "+" | "-",
    params:
      | { lvec: THREE.Vector3; ldir: string; lxlvecNormal: THREE.Vector3 }
      | undefined = undefined
  ): Map<string, number> {
    if (!this.localAxis) {
      return new Map<string, number>();
    }
    params ??= {
      lvec: this.localAxis.y,
      ldir: "ly",
      lxlvecNormal: this.localAxis.z,
    };
    const result = new Map<string, number>([[`${params.ldir}${pm}`, 1]]);
    [
      {
        gvec: new THREE.Vector3(1, 0, 0),
        gdir: "gx",
      },
      {
        gvec: new THREE.Vector3(0, 1, 0),
        gdir: "gy",
      },
      {
        gvec: new THREE.Vector3(0, 0, 1),
        gdir: "gz",
      },
    ].forEach(({ gvec, gdir }) => {
      const lxgvecNormal = this.localAxis.x.clone().cross(gvec); // lx-gvec面の法線ベクトル
      if (params.lxlvecNormal.clone().cross(lxgvecNormal).length() === 0) {
        // lx-lvec面とlx-gvec面が平行な場合
        const angle = params.lvec.angleTo(gvec);
        const sec = 1 / Math.abs(Math.cos(angle));
        if (isFinite(sec)) {
          if (angle < Math.PI / 2) {
            result.set(`${gdir}${pm}`, sec);
          } else {
            result.set(`${gdir}${pm === "+" ? "-" : "+"}`, sec);
          }
        }
        return;
      }
    });
    return result;
  }
  private getParam_lz(pm: "+" | "-"): Map<string, number> {
    if (!this.localAxis) {
      return new Map<string, number>();
    }
    return this.getParam_ly(pm, {
      lvec: this.localAxis.z,
      ldir: "lz",
      lxlvecNormal: this.localAxis.y,
    });
  }
  private getParam_gx(
    pm: "+" | "-",
    { gvec, gdir } = { gvec: new THREE.Vector3(1, 0, 0), gdir: "gx" }
  ): Map<string, number> {
    const result = new Map<string, number>([[`${gdir}${pm}`, 1]]);
    if (this.localAxis) {
      const lxgvecNormal = this.localAxis.x.clone().cross(gvec);
      [
        {
          lvec: this.localAxis.y,
          ldir: "ly",
        },
        {
          lvec: this.localAxis.z,
          ldir: "lz",
        },
      ].forEach(({ lvec, ldir }) => {
        const lxlvecNormal = this.localAxis.x.clone().cross(lvec); // lx-lvec面の法線ベクトル
        if (lxlvecNormal.clone().cross(lxgvecNormal).length() === 0) {
          // lx-lvec面とlx-gvec面が平行な場合
          const angle = lvec.angleTo(gvec);
          const cos = Math.abs(Math.cos(angle));
          if (cos !== 0) {
            if (angle < Math.PI / 2) {
              result.set(`${ldir}${pm}`, cos);
            } else {
              result.set(`${ldir}${pm === "+" ? "-" : "+"}`, cos);
            }
          }
          return;
        }
      });
    }
    return result;
  }
  private getParam_gy(pm: "+" | "-"): Map<string, number> {
    return this.getParam_gx(pm, {
      gvec: new THREE.Vector3(0, 1, 0),
      gdir: "gy",
    });
  }
  private getParam_gz(pm: "+" | "-"): Map<string, number> {
    return this.getParam_gx(pm, {
      gvec: new THREE.Vector3(0, 0, 1),
      gdir: "gz",
    });
  }
  private getParam_R(): Map<string, number> {
    const result = new Map<string, number>();
    if (this.localAxis) {
      ["ly+", "ly-", "lz+", "lz-"].forEach((ldir) => result.set(ldir, 1));
      [
        { gvec: new THREE.Vector3(1, 0, 0), gdir: "gx" },
        { gvec: new THREE.Vector3(0, 1, 0), gdir: "gy" },
        { gvec: new THREE.Vector3(0, 0, 1), gdir: "gz" },
      ].forEach(({ gvec, gdir }) => {
        const angle = this.localAxis.x.angleTo(gvec);
        const csc = 1 / Math.abs(Math.sin(angle));
        if (isFinite(csc)) {
          result.set(`${gdir}+`, csc);
          result.set(`${gdir}-`, csc);
        }
      });
    }
    return result;
  }

  /** 指定されたオフセットの向きごとのオフセットの向き別オフセット補正係数 */
  private coefDict: {
    [key: string]: Map<string, number> | undefined;
  } = {
    rlx: undefined,
    rly: undefined,
    rlz: undefined,
    rgx: undefined,
    rgy: undefined,
    rgz: undefined,
    "ly+": undefined,
    "ly-": undefined,
    "lz+": undefined,
    "lz-": undefined,
    "gx+": undefined,
    "gx-": undefined,
    "gy+": undefined,
    "gy-": undefined,
    "gz+": undefined,
    "gz-": undefined,
    R: undefined,
  };

  /**
   * 指定されたオフセットの向きに対するオフセット値でオフセット情報を更新する
   * @param offsetdir オフセットの向き
   * @param offset 更新用オフセット値
   */
  update(offsetdir: OffsetDirection, offset: number): void {
    if (!this.coefDict[offsetdir]) {
      let map: Map<string, number>;
      switch (offsetdir) {
        case "rlx":
          map = this.getParam_rlx();
          break;
        case "rly":
          map = this.getParam_rly();
          break;
        case "rlz":
          map = this.getParam_rlz();
          break;
        case "rgx":
          map = this.getParam_rgx();
          break;
        case "rgy":
          map = this.getParam_rgy();
          break;
        case "rgz":
          map = this.getParam_rgz();
          break;
        case "ly+":
          map = this.getParam_ly("+");
          break;
        case "ly-":
          map = this.getParam_ly("-");
          break;
        case "lz+":
          map = this.getParam_lz("+");
          break;
        case "lz-":
          map = this.getParam_lz("-");
          break;
        case "gx+":
          map = this.getParam_gx("+");
          break;
        case "gx-":
          map = this.getParam_gx("-");
          break;
        case "gy+":
          map = this.getParam_gy("+");
          break;
        case "gy-":
          map = this.getParam_gy("-");
          break;
        case "gz+":
          map = this.getParam_gz("+");
          break;
        case "gz-":
          map = this.getParam_gz("-");
          break;
        case "R":
          map = this.getParam_R();
          break;
        default:
          throw new Error();
      }
      this.coefDict[offsetdir] = map;
    }
    this.coefDict[offsetdir].forEach((coef, dir) => {
      const actualOffset = offset * coef;
      if (this.dict[dir] < actualOffset) {
        this.dict[dir] = actualOffset;
      }
    });
  }

  /**
   * 指定された向きのオフセット値を返す
   * @param direction オフセットの向き
   * @returns 指定された向きのオフセット値
   */
  get(direction: OffsetDirection): number {
    return this.dict[direction];
  }

  /**
   * 対象のオフセット情報の中で指定された向きの最大のオフセット値を返す
   * @param direction オフセットの向き
   * @param targets 対象のオフセット情報
   * @returns 対象のオフセット情報の中で指定された向きの最大のオフセット値
   */
  static getMax(direction: OffsetDirection, ...targets: OffsetDict[]): number {
    if (targets.length === 0) {
      throw new Error();
    }
    return targets
      .map((t) => t.get(direction))
      .reduce((v1, v2) => Math.max(v1, v2));
  }
}

/**
 * 各種荷重値の最大値
 * pMax: 節点荷重(t)と部材集中荷重(1)
 * mMax: 節点モーメント(r)と部材集中モーメント(11)
 * wMax: 部材分布荷重(2xと2rを除く)
 * rMax: 部材ねじりモーメント(2r)
 * qMax: 部材軸方向分布荷重(2x)
 */
export type MaxLoadDict = {
  pMax: number;
  mMax: number;
  wMax: number;
  rMax: number;
  qMax: number;
};

/** 荷重データの基底クラス */
export abstract class LoadData extends THREE.Group {
  /** 荷重の種別 */
  abstract get loadType(): string;

  /**
   * 荷重図の再配置
   * @param nodeOffsetDictMap key=節点番号、value=各接点のOffsetDict
   * @param memberOffsetDictMap key=部材番号、value=各部材のOffsetDict
   * @param maxLoadDict
   * @param scale 描画スケール
   * @param isSelected true=ハイライト表示、false=ハイライト表示解除、undefined=状態継続
   */
  abstract relocate(
    nodeOffsetDictMap: Map<string, OffsetDict>,
    memberOffsetDictMap: Map<string, OffsetDict>,
    maxLoadDict: MaxLoadDict,
    scale: number,
    isSelected: boolean | undefined
  ): void;

  /**
   * 選択状態と非選択状態の切り替え
   * @param isSelected true=選択状態、false=非選択状態
   */
  abstract highlight(isSelected: boolean): void;

  /** この荷重と関連を持つ節点の節点番号一覧 */
  abstract get correspondingNodeNoList(): string[];
  /** この荷重と関連を持つ部材の部材番号一覧 */
  abstract get correspondingMemberNoList(): string[];

  /** 荷重値の最大値(節点荷重と部材集中荷重) */
  abstract get pMax(): number;
  /** 荷重値の最大値(節点モーメントと部材集中モーメント) */
  abstract get mMax(): number;
  /** 荷重値の最大値(部材分布荷重) */
  abstract get wMax(): number;
  /** 荷重値の最大値(部材ねじりモーメント) */
  abstract get rMax(): number;
  /** 荷重値の最大値(部材軸方向分布荷重) */
  abstract get qMax(): number;

  /** 荷重テーブルの列情報(m=部材荷重、p=節点荷重) */
  abstract get col(): "m" | "p";

  /** 荷重テーブルの行番号 */
  abstract get row(): number;

  /**
   * 荷重の積み上げ順を決める数値(値が小さいほど節点または部材に近く表示する。モーメント系は積み上げ対象外)
   * 0=節点モーメント(r)、部材集中モーメント(11)、部材分布モーメント(2r)
   * 10=部材集中荷重(1)、部材分布荷重(2)、温度(9)
   * 20=節点荷重(t)
   */
  abstract get rank(): number;

  // this.name: string - 例：DistributeLoad-3-y
  // this.position: Vector3 - 部材基準点(i端節点とj端節点の中点)の座標
}
