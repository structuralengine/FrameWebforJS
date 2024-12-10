import { Injectable } from "@angular/core";
import { SceneService } from "../../scene.service";
import { InputNodesService } from "../../../input/input-nodes/input-nodes.service";
import { InputMembersService } from "../../../input/input-members/input-members.service";
import { InputLoadService } from "../../../input/input-load/input-load.service";
import { ThreeNodesService } from "../three-nodes.service";

import * as THREE from "three";

import { ThreeMembersService } from "../three-members.service";

// import { ThreeLoadText } from "./three-load-text";
import { ThreeLoadDimension } from "./three-load-dimension";
import { ThreeLoadPoint } from "./three-load-point";
import { ThreeLoadDistribute } from "./three-load-distribute";
import { ThreeLoadAxial } from "./three-load-axial";
import { ThreeLoadTorsion } from "./three-load-torsion";
import { ThreeLoadMoment } from "./three-load-moment";
import { ThreeLoadTemperature } from "./three-load-temperature";
import { ThreeLoadMemberPoint } from "./three-load-member-point";
import { ThreeLoadMemberMoment } from "./three-load-member-moment";
import { DataHelperModule } from "src/app/providers/data-helper.module";
// import { connectableObservableDescriptor } from "rxjs/internal/observable/ConnectableObservable";
import { withLatestFrom } from "rxjs-compat/operator/withLatestFrom";
import { forEach } from '@angular-devkit/schematics';
import { LanguagesService } from "src/app/providers/languages.service";
import { LoadData, LocalAxis, MaxLoadDict, OffsetDict } from "./three-load-common";

type CaseData = {
  ThreeObject: THREE.Object3D,
  /** 荷重データの一覧 */
  loadList: LoadData[],
  /** 荷重種別ごとの荷重最大値 */
  maxLoadDict: MaxLoadDict;
  /** 各部材の部材座標系。キーは部材番号。不要になったデータを削除する処理がないので、Object.{keys|values|entries}でループを回す場合は注意 */
  localAxisDict: {
    [key: string]: LocalAxis
  }
};

@Injectable({
  providedIn: "root",
})
export class ThreeLoadService {
  private isVisible = { object: false, gui: false };

  // 全ケースの荷重を保存
  private AllCaseLoadList: {
    [key: string]: CaseData // キーはケース番号
  };
  private currentIndex: string; // 現在 表示中のケース番号

  // 荷重のテンプレート
  private loadEditor: {};

  private nodeData: any; // 荷重図作成時の 節点データ
  private memberData: any; // 荷重図作成時の 要素データ

  private newNodeData: any; // 変更された 節点データ
  private newMemberData: any; // 変更された 要素データ

  // 選択中のオブジェクト
  private selecteddObject: any;

  // アニメーションのオブジェクト
  private animationObject: any;

  // 初期化
  constructor(
    private languagesService: LanguagesService,
    private scene: SceneService,
    private helper: DataHelperModule,
    private nodeThree: ThreeNodesService,
    private node: InputNodesService,
    private member: InputMembersService,
    private load: InputLoadService,
    private three_member: ThreeMembersService
  ) {
    // 荷重の雛形をあらかじめ生成する
    this.loadEditor = {};
    // 全てのケースの荷重情報
    this.AllCaseLoadList = {};
    this.currentIndex = null;

    // 節点、部材データ
    this.nodeData = null;
    this.memberData = null;
    this.newNodeData = null;
    this.newMemberData = null;

    // 選択中のオブジェクト
    this.selecteddObject = null;

    // アニメーションのオブジェクト
    this.animationObject = null;
  }

  // 荷重を再設定する
  public ClearData(): void {
    // 荷重を全部削除する
    for (const id of Object.keys(this.AllCaseLoadList)) {
      this.removeCase(id);
    }

    this.AllCaseLoadList = {};
    this.currentIndex = null;

    // 節点、部材データ
    this.nodeData = null;
    this.memberData = null;
    this.newNodeData = null;
    this.newMemberData = null;

    // 選択中のオブジェクト
    this.selecteddObject = null;

    // アニメーションのオブジェクト
    if (this.animationObject !== null) {
      cancelAnimationFrame(this.animationObject);
      this.animationObject = null;
    }
  }

  // ファイルを読み込むなど、りセットする
  public ResetData(): void {
    this.ClearData();

    // ファイルを開いたときの処理
    // 荷重を作成する
    const loadData = this.load.getLoadJson(0);
    for (const id of Object.keys(loadData)) {
      this.addCase(id);
    }

    // データを入手
    this.nodeData = this.node.getNodeJson(0);
    this.memberData = this.member.getMemberJson(0);

    // 格点データ
    this.newNodeData = null;
    if (Object.keys(this.nodeData).length <= 0) {
      return; // 格点がなければ 以降の処理は行わない
    }

    // 節点荷重データを入手
    // const nodeLoadData = this.load.getNodeLoadJson(0);
    const nodeLoadData = {};
    // 要素荷重データを入手
    const memberLoadData = {};
    for (const id of Object.keys(loadData)) {
      const tmp = loadData[id];
      if ("load_member" in tmp && tmp.load_member.length > 0) {
        memberLoadData[id] = tmp.load_member;
      }
      if ("load_node" in tmp && tmp.load_node.length > 0) {
        nodeLoadData[id] = tmp.load_node;
      }
    }

    // 荷重図を(非表示のまま)作成する
    for (const id of Object.keys(this.AllCaseLoadList)) {
      const LoadList = this.AllCaseLoadList[id];
      this.currentIndex = id; // カレントデータをセット // @TODO: この行を削除したいけど、削除すると後続のthis.onResize()の挙動に問題が・・・

      // 節点荷重 --------------------------------------------
      if (id in nodeLoadData) {
        const targetNodeLoad = nodeLoadData[id];
        // // 節点荷重の最大値を調べる
        // this.setMaxNodeLoad(targetNodeLoad);
        // 節点荷重を作成する
        this.createPointLoad(
          targetNodeLoad,
          this.nodeData,
          this.memberData,
          LoadList.ThreeObject,
          LoadList.loadList
        );
      }

      // 要素荷重 --------------------------------------------
      // 要素データを入手
      this.newMemberData = null;
      if (Object.keys(this.memberData).length > 0) {
        if (id in memberLoadData) {
          const targetMemberLoad = memberLoadData[id];
          // // 要素荷重の最大値を調べる
          // this.setMaxMemberLoad(targetMemberLoad);
          // 要素荷重を作成する
          this.createMemberLoad(
            targetMemberLoad,
            this.nodeData,
            this.memberData,
            LoadList.ThreeObject,
            LoadList.loadList,
            LoadList.localAxisDict
          );
        }
      }

      // 荷重の最大値を調べる
      this.updateMaxLoad(id);
      // 荷重データの並び替え
      this.loadListSort();
    }

    // @TODO: この時点でのthis.currentIndexは・・・

    // 重なりを調整する
    this.setOffset();
    // 重なりを調整する
    this.onResize();

    this.currentIndex = "-1"; // @TODO: これ何？
  }

  // 表示ケースを変更する
  public changeCase(changeCase: number, isLL_Load: boolean = false): void {
    
    // 全てのオブジェクトをデフォルトのカラーの状態にする
    this.selectChange(-1, ''); 

        // 連行荷重が完成したら 以下のアニメーションを有効にする
    // 荷重名称を調べる
    if(isLL_Load===false){
      const symbol: string = this.load.getLoadName(changeCase, "symbol");
      isLL_Load = symbol.includes("LL");
    }

    if (this.animationObject !== null) {
      cancelAnimationFrame(this.animationObject);
      this.animationObject = null;
    }

    this.currentIndex = changeCase.toString();
    if (!isLL_Load) {
      this.visibleCaseChange(this.currentIndex);

    } else {
      // 連行荷重の場合
      const LL_list = this.load.getMemberLoadJson(0, this.currentIndex);
      const LL_keys: string[] = Object.keys(LL_list);
      if (LL_keys.length > 0) {
        if (this.animationObject !== null) {
          cancelAnimationFrame(this.animationObject);
          this.animationObject = null;
        }

        this.animation(LL_keys, LL_list); //ループのきっかけ
        return;
      }
    }

    this.onResize();

    this.scene.render();
  }

  private visibleCaseChange(id: string, isLL_Load= false): void {

    if (id === null) {
      // 非表示にして終わる
      for (const key of Object.keys(this.AllCaseLoadList)) {
        const targetLoad = this.AllCaseLoadList[key];
        const ThreeObject: THREE.Object3D = targetLoad.ThreeObject;
        ThreeObject.visible = false;
      }
      // アニメーションのオブジェクトを解放
      if (this.animationObject !== null) {
        cancelAnimationFrame(this.animationObject);
        this.animationObject = null;
      }
      // this.scene.render();
      this.currentIndex = id;
      return;
    }

    // 初めての荷重ケースが呼び出された場合
    if (!(id in this.AllCaseLoadList)) {
      this.addCase(id);
    }

    // 荷重の表示非表示を切り替える
    for (const key of Object.keys(this.AllCaseLoadList)) {
      const targetLoad = this.AllCaseLoadList[key];
      console.log("targetLoad",targetLoad)
      const ThreeObject: THREE.Object3D = targetLoad.ThreeObject;
      ThreeObject.visible = key === id ? true : false;
    }

    // カレントデータをセット
    if(isLL_Load == false) { // 連行荷重アニメーション中は currentIndex は 親id のまま変えない
      this.currentIndex = id;
    }

  }

  // 連行移動荷重のアニメーションを開始する
  public animation(keys: string[], LL_list: any, i: number = 0, old_j: number = 0) {

    // アニメーションのオブジェクトを解放
    if (this.animationObject !== null) {
      cancelAnimationFrame(this.animationObject);
      this.animationObject = null;
    }


    let j: number = Math.floor(i / 10); // 10フレームに１回位置を更新する

    if(j < keys.length){
      i = i + 1; // 次のフレーム
    }else{
      i = 0;
      j = 0;
    }


    // 次のフレームを要求
    this.animationObject = requestAnimationFrame(() => {
      this.animation(keys, LL_list, i, j);
    });

    if(j === old_j){
      return;
    }

    this.visibleCaseChange(keys[j], true)
    // レンダリングする
    this.scene.render();
 
  }

  // ケースを追加する
  private addCase(id: string): void {
    const ThreeObject = new THREE.Object3D();
    ThreeObject.name = id;
    ThreeObject.visible = false; // ファイルを読んだ時点では、全ケース非表示
    this.AllCaseLoadList[id] = {
      ThreeObject,
      loadList: [],
      maxLoadDict: {
        pMax: 0, // 最も大きい集中荷重値
        mMax: 0, // 最も大きいモーメント
        wMax: 0, // 最も大きい分布荷重
        rMax: 0, // 最も大きいねじり分布荷重
        qMax: 0, // 最も大きい軸方向分布荷重
      },
      localAxisDict: {}
    };

    this.scene.add(ThreeObject); // シーンに追加
  }

  /**
   * シートの選択行が指すオブジェクトをハイライトする
   * @param index_row 選択行の行番号
   * @param index_column 選択されたカラムの列見出し
   */
  public selectChange(index_row: number, index_column: string): void {
    const id: string = this.currentIndex;
    if (!this.AllCaseLoadList[id]) {
      return;
    }
    const threeObject = this.AllCaseLoadList[id].ThreeObject;

    for (const child of threeObject.children) {
      const item = child as LoadData;

      let column = '';
      if (["n", "tx", "ty", "tz", "rx", "ry", "rz"].includes(index_column)) {
        // 節点荷重の場合
        column = index_column;
      } else {
        // 部材荷重の場合
        column = "m";
      }
      const key = item.loadType + "-" + index_row.toString() + "-" + column;

      if (item.name.startsWith(key)) {
        item.highlight(true);
        this.scene.getScreenPosition(item);
      } else {
        item.highlight(false);
      }
    }

    this.scene.render();
  }

  // ケースの荷重図を消去する
  public removeCase(id: string, option: boolean = true): void {
    if (!(id in this.AllCaseLoadList)) {
      return;
    }

    const data = this.AllCaseLoadList[id];
    this.removeMemberLoadList(data);
    this.removePointLoadList(data);

    const ThreeObject = data.ThreeObject;
    this.scene.remove(ThreeObject);

    delete this.AllCaseLoadList[id];

    // アニメーションのオブジェクトを解放
    if (this.animationObject !== null) {
      cancelAnimationFrame(this.animationObject);
      this.animationObject = null;
    }

    if(option){
      this.scene.render();
    }
  }

  // 節点の入力が変更された場合 新しい入力データを保持しておく
  public changeNode(jsonData): void {
    this.newNodeData = jsonData;
  }

  // 要素の入力が変更された場合 新しい入力データを保持しておく
  public changeMember(jsonData): void {
    this.newMemberData = jsonData;
  }

  // 節点や要素が変更された部分を描きなおす
  public reDrawNodeMember(): void {
    if (this.newNodeData === null && this.newMemberData === null) {
      return;
    }

    // 格点の変わった部分を探す
    const changeNodeList = {};
    if (this.nodeData !== null) {
      if (this.newNodeData !== null) {
        for (const key of Object.keys(this.nodeData)) {
          if (!(key in this.newNodeData)) {
            // 古い情報にあって新しい情報にない節点
            changeNodeList[key] = "delete";
          }
        }
        for (const key of Object.keys(this.newNodeData)) {
          if (!(key in this.nodeData)) {
            // 新しい情報にあって古い情報にない節点
            changeNodeList[key] = "add";
            continue;
          }
          const oldNode = this.nodeData[key];
          const newNode = this.newNodeData[key];
          if (
            oldNode.x !== newNode.x ||
            oldNode.y !== newNode.y ||
            oldNode.z !== newNode.z
          ) {
            changeNodeList[key] = "change";
          }
        }
      }
    }

    const changeMemberList = {};
    if (this.memberData !== null) {
      // 部材の変わった部分を探す
      if (this.newMemberData !== null) {
        for (const key of Object.keys(this.memberData)) {
          if (!(key in this.newMemberData)) {
            // 古い情報にあって新しい情報にない節点
            changeMemberList[key] = "delete";
          }
        }
        for (const key of Object.keys(this.newMemberData)) {
          if (!(key in this.memberData)) {
            // 新しい情報にあって古い情報にない節点
            changeMemberList[key] = "add";
            continue;
          }
          const oldMember = this.memberData[key];
          const newMember = this.newMemberData[key];
          if (oldMember.ni !== newMember.ni || oldMember.nj !== newMember.nj || oldMember.cg !== newMember.cg) {
            changeMemberList[key] = "change";
          }
        }
      }
    }
    // 格点の変更によって影響のある部材を特定する
    const targetMemberData =
      this.newMemberData !== null ? this.newMemberData : this.memberData;
    if (targetMemberData !== null) {
      for (const key of Object.keys(targetMemberData)) {
        const newMember = targetMemberData[key];
        if (newMember.ni in changeNodeList || newMember.nj in changeNodeList) {
          changeMemberList[key] = "node change";
        }
      }
    }

    // 荷重を変更する
    const oldIndex = this.currentIndex;
    this.nodeData =
      this.newNodeData !== null ? this.newNodeData : this.nodeData;
    this.memberData =
      this.newMemberData !== null ? this.newMemberData : this.memberData;
    // 荷重データを入手
    const nodeLoadData = this.load.getNodeLoadJson(0);
    const memberLoadData = this.load.getMemberLoadJson(0);
    // 荷重を修正
    for (const id of Object.keys(this.AllCaseLoadList)) {
      this.currentIndex = id;
      let editFlg = false;
      if (this.currentIndex in nodeLoadData) {
        for (const load of nodeLoadData[this.currentIndex]) {
          if (load.n.toString() in changeNodeList)
            this.changeNodeLode(load.row, nodeLoadData);
          editFlg = true;
        }
      }
      if (this.currentIndex in memberLoadData) {
        for (const load of memberLoadData[this.currentIndex]) {
          if (load.m.toString() in changeMemberList) {
            this.changeMemberLode(load.row, memberLoadData);
            editFlg = true;
          }
        }
      }
      if (editFlg === true) {
        this.setOffset();
        this.onResize();
      }
    }

    this.newNodeData = null;
    this.newMemberData = null;
    this.currentIndex = oldIndex;
  }

  // 連行荷重を変更する
  public change_LL_Load(id: string): void{

    const memberLoadData = this.load.getMemberLoadJson(0, id); //計算に使う版
    const LL_keys = Object.keys(memberLoadData);

    // 対象の連行荷重を全部削除する
    let keys = Object.keys(this.AllCaseLoadList).filter(e =>{
      return e.indexOf(id + ".") === 0;
    })
    if(keys !== undefined){
      keys = [id].concat(keys)
      for (const key of keys) {
        this.removeCase(key);
      }
    } else{
      keys = [id];
    }

    if (Object.keys(this.memberData).length > 0) {
      for(const key of LL_keys){
        // 一旦削除したので追加する
        this.addCase(key);
        const LoadList = this.AllCaseLoadList[key];
        // 
        const targetMemberLoad = memberLoadData[key];
        // 要素荷重を作成する
        this.createMemberLoad(
          targetMemberLoad,
          this.nodeData,
          this.memberData,
          LoadList.ThreeObject,
          LoadList.loadList,
          LoadList.localAxisDict
        );
      }
      // 荷重の最大値を調べる
      Object.keys(memberLoadData).forEach((caseStr) => {
        this.updateMaxLoad(caseStr);
      });
      // 荷重データの並び替え
      this.loadListSort();
      // 重なりを調整する
      this.setOffset();
      // サイズを調整する
      this.onResize();
    }

    // 一旦アニメーションを削除
    if (this.animationObject !== null) {
      cancelAnimationFrame(this.animationObject);
      this.animationObject = null;
    }

    // 連行荷重の場合
    this.animation(LL_keys, memberLoadData); //ループのきっかけ

  }

  // 荷重の入力が変更された場合
  public changeData(row: number): void {

    let row1 = row; // 変更・調整されるrow1を定義

    const index = parseInt(this.currentIndex, 10);
    const symbol: string = this.load.getLoadName(index, "symbol");
    if(symbol === "LL"){
      this.change_LL_Load(this.currentIndex);
      return;
    }

    // データになカレントデータがなければ
    if (!(this.currentIndex in this.load.load)) {
      this.removeCase(this.currentIndex);
      return;
    }

    // 格点データを入手
    if (this.nodeData === null) {
      return; // 格点がなければ 以降の処理は行わない
    }
    if (Object.keys(this.nodeData).length <= 0) {
      return; // 格点がなければ 以降の処理は行わない
    }

    // 節点荷重データを入手
    const nodeLoadData = this.load.getNodeLoadJson(0, this.currentIndex);
    // 節点荷重を変更
    this.changeNodeLode(row, nodeLoadData);

    // 要素データを入手
    if (this.memberData === null) {
      return; //要素がなければ 以降の処理は行わない
    }
    if (Object.keys(this.memberData).length <= 0) {
      return; //要素がなければ 以降の処理は行わない
    }

    const tempMemberLoad = this.load.getMemberLoadJson(null, this.currentIndex); //計算に使う版
    const memberLoadData = this.load.getMemberLoadJson(0, this.currentIndex); //計算に使う版

    if (this.currentIndex in memberLoadData) {
      // 要素荷重を変更
      this.changeMemberLode(row1, memberLoadData); //実際に荷重として使っているのは　memberLoadData こっち

      // 対象行以下の行について
      row1++;
      const tmLoad = tempMemberLoad[this.currentIndex];
      let i = tmLoad.findIndex((e) => e.row === row1);
      while (i >= 0) {
        if (tmLoad[i].L1 == null) {
          break;
        }
        if (!tmLoad[i].L1.includes("-")) {
          break;
        }
        // 要素荷重を変更
        this.changeMemberLode(tmLoad[i].row, memberLoadData); //実際に荷重として使っているのは　memberLoadData こっち
        row1++;
        i = tmLoad.findIndex((e) => e.row === row1);
      }
    }

    // 荷重の最大値を調べる
    new Set(...Object.keys(nodeLoadData), ...Object.keys(memberLoadData)).forEach((caseStr) => {
      this.updateMaxLoad(caseStr);
    });

    // 荷重データの並び替え
    this.loadListSort();

    // 重なりを調整する
    this.setOffset();
    // サイズを調整する
    this.onResize();
    // レンダリング
    this.scene.render();
    // 表示フラグを ON にする
    this.isVisible.object = true;
  }

  // 荷重の入力が変更された場合（複数行）
  public changeDataList(param): void {

    const { updatedRows } = param;

    const index = parseInt(this.currentIndex, 10);
    const symbol: string = this.load.getLoadName(index, "symbol");
    if(symbol === "LL"){
      this.change_LL_Load(this.currentIndex);
      return;
    }

    // データになカレントデータがなければ
    if (!(this.currentIndex in this.load.load)) {
      this.removeCase(this.currentIndex);
      return;
    }

    // 格点データを入手
    if (this.nodeData === null) {
      return; // 格点がなければ 以降の処理は行わない
    }
    if (Object.keys(this.nodeData).length <= 0) {
      return; // 格点がなければ 以降の処理は行わない
    }

    // 要素データを入手
    if (this.memberData === null) {
      return; //要素がなければ 以降の処理は行わない
    }
    
    if (Object.keys(this.memberData).length <= 0) {
      return; //要素がなければ 以降の処理は行わない
    }

    const tempMemberLoad = this.load.getMemberLoadJson(null, this.currentIndex); //計算に使う版
    let memberLoadData = this.load.getMemberLoadJson(0, this.currentIndex); //計算に使う版
    
    // TODO: 「確認要」荷重強度をすべて削除するとレンダリングにならないトラブルを解消
    if (!(this.currentIndex in memberLoadData)) {
      memberLoadData[this.currentIndex] = [];
    }

    // 節点荷重データを入手
    const nodeLoadData = this.load.getNodeLoadJson(0, this.currentIndex);

    updatedRows.forEach((row: number) => {

      let row1 = row; // 変更・調整されるrow1を定義

      // 節点荷重を変更
      this.changeNodeLode(row, nodeLoadData);
  
  
      if (this.currentIndex in memberLoadData) {
        // 要素荷重を変更
        this.changeMemberLode(row1, memberLoadData); //実際に荷重として使っているのは　memberLoadData こっち
  
        // 対象行以下の行について
        row1++;
        const tmLoad = tempMemberLoad[this.currentIndex];
        if (!tmLoad) {
          return;
        }
        let i = tmLoad.findIndex((e) => e.row === row1);
        while (i >= 0) {
          if (tmLoad[i].L1 == null) {
            break;
          }
          if (!tmLoad[i].L1.includes("-")) {
            break;
          }
          // 要素荷重を変更
          this.changeMemberLode(tmLoad[i].row, memberLoadData); //実際に荷重として使っているのは　memberLoadData こっち
          row1++;
          i = tmLoad.findIndex((e) => e.row === row1);
        }
      }
    })

    // 荷重の最大値を調べる
    new Set(...Object.keys(nodeLoadData), ...Object.keys(memberLoadData)).forEach((caseStr) => {
      this.updateMaxLoad(caseStr);
    });

    // 荷重データの並び替え
    this.loadListSort();

    // 重なりを調整する
    this.setOffset();
    // サイズを調整する
    this.onResize();
    // レンダリング
    this.scene.render();
    // 表示フラグを ON にする
    this.isVisible.object = true;
  }

  // 節点荷重を変更
  private changeNodeLode(row: number, nodeLoadData: any): void {
    const LoadList = this.AllCaseLoadList[this.currentIndex];

    if (this.currentIndex in nodeLoadData) {
      // 節点荷重の最大値を調べる
      const tempNodeLoad = nodeLoadData[this.currentIndex];

      // 対象行(row) に入力されている部材番号を調べる
      const targetNodeLoad = tempNodeLoad.filter((load) => load.row === row);

      this.removePointLoadList(LoadList, row);

      this.createPointLoad(
        targetNodeLoad,
        this.nodeData,
        this.memberData,
        LoadList.ThreeObject,
        LoadList.loadList
      );
    } else {
      // ケースが存在しなかった
      this.removePointLoadList(LoadList);
    }
  }

  // 節点荷重を削除する
  private removePointLoadList(LoadList: CaseData, row: number | undefined = undefined): void {
    const list = LoadList.loadList;
    for (let i = list.length - 1; i >= 0; i--) {
      const item = list[i];
      if (item.col !== "p") {
        // 節点荷重ではない荷重は処理対象外
        continue;
      }
      if (row && item.row !== row) {
        continue;
      }
      LoadList.ThreeObject.remove(item);
      list.splice(i, 1);
    }
  }

  // 要素荷重を変更
  private changeMemberLode(row: number, memberLoadData: any): void {

    for (const key of Object.keys(memberLoadData)) {

      // "LL"（連行荷重）の時に発生する
      if (this.AllCaseLoadList[key] === undefined) {
        this.addCase(key) // 来ないと思う
      }
      const LoadList = this.AllCaseLoadList[key];

      // 対象業(row) に入力されている部材番号を調べる
      const tempMemberLoad = memberLoadData[key];

      // 対象行(row) に入力されている部材番号を調べる
      const targetMemberLoad = tempMemberLoad.filter(
        (load) => load.row === row
      );
      // 同じ行にあった荷重を一旦削除
      this.removeMemberLoadList(LoadList, row);

      this.createMemberLoad(
        targetMemberLoad,
        this.nodeData,
        this.memberData,
        LoadList.ThreeObject,
        LoadList.loadList,
        LoadList.localAxisDict
      );

    }
  }

  // 要素荷重を削除する
  private removeMemberLoadList(LoadList: CaseData, row = null): void {
    const list = LoadList.loadList;
    for (let i = list.length - 1; i >= 0; i--) {
      const item = list[i];
      if (item.col !== "m") {
        // 部材荷重ではない荷重は処理対象外
        continue;
      }
      if (row !== null && item.row !== row) {
        continue;
      }
      LoadList.ThreeObject.remove(item);
      list.splice(i, 1);
    }
  }

  // 節点荷重の矢印を描く
  private createPointLoad(
    targetNodeLoad: any[],
    nodeData: object,
    memberData: object,
    threeObject: THREE.Object3D,
    pointLoadList: LoadData[]
  ): void {
    if (!targetNodeLoad) {
      return;
    }

    // 集中荷重の矢印をシーンに追加する
    for (const load of targetNodeLoad) {
      const n = load.n.toString(); // 節点番号

      if (!(n in nodeData)) {
        continue;
      }
      const node = nodeData[n];
      const position = new THREE.Vector3(node.x, node.y, node.z)

      const mNoList = new Array<string>();
      for (const mNo in memberData) {
        const member = memberData[mNo];
        if (member.ni == n || member.nj == n) {
          mNoList.push(mNo.toString())
        }
      }

      // 集中荷重 ---------------------------------

      for (let key of ["tx", "ty", "tz"]) {
        if (!(key in load)) continue;

        const value = load[key];
        if (value === 0) continue;

        const arrow = ThreeLoadPoint.create(n, mNoList, position, key, value, load.row);
        if (!arrow) {
          continue;
        }

        pointLoadList.push(arrow);
        threeObject.add(arrow);
      }

      // 節点モーメント荷重 -------------------------
      for (const key of ["rx", "ry", "rz"]) {
        if (!(key in load)) continue;

        const value = load[key];
        if (load[key] === 0) continue;

        const arrow = ThreeLoadMoment.create(n, position, key, value, load.row);
        if (!arrow) {
          continue;
        }

        pointLoadList.push(arrow);
        threeObject.add(arrow);
      }
    }
  }

  // 要素荷重の矢印を描く
  private createMemberLoad(
    memberLoadData: any[],
    nodeData: object,
    memberData: object,
    ThreeObject: THREE.Object3D,
    memberLoadList: LoadData[],
    localAxisDict: {
      [key: string]: LocalAxis
    }
  ): void {
    if (!memberLoadData) {
      return;
    }

    // memberLoadData情報を書き換える可能性があるので、複製する // @TODO: 書き換えないと思う・・・
    const targetMemberLoad = structuredClone(memberLoadData);

    // 分布荷重の矢印をシーンに追加する
    for (const load of targetMemberLoad) {
      // 部材データを集計する
      if (!(load.m in memberData)) {
        continue;
      }
      const mNo: string = load.m.toString(); // 部材番号
      const m = memberData[mNo];
      // 節点データを集計する
      if (!(m.ni in nodeData && m.nj in nodeData)) {
        continue;
      }

      if (load.P1 === 0 && load.P2 === 0) {
        continue;
      }

      // 部材の座標軸を取得
      const i = nodeData[m.ni];
      const j = nodeData[m.nj];
      const nodei = new THREE.Vector3(i.x, i.y, i.z);
      const nodej = new THREE.Vector3(j.x, j.y, j.z);
      const localAxis = new LocalAxis(this.three_member.localAxis(
        i.x,
        i.y,
        i.z,
        j.x,
        j.y,
        j.z,
        m.cg
      ));
      localAxisDict[mNo] = localAxis;

      // 荷重値と向き -----------------------------------
      let P1: number = load.P1;
      let P2: number = load.P2;
      let direction: string | undefined = load.direction;

      direction = direction?.trim().toLowerCase() ?? "";

      const originalDirection = direction;
      if (localAxis.x.y === 0 && localAxis.x.z === 0) {
        // x軸に平行
        if (direction === "gx") direction = "x";
        if (direction === "gy") direction = "y";
        if (direction === "gz") direction = "z";
      } else if (localAxis.x.x === 0 && localAxis.x.z === 0) {
        // y軸に平行
        if (direction === "gx") {
          direction = "y";
          P1 = -P1;
          P2 = -P2;
        }
        if (direction === "gy") direction = "x";
        if (direction === "gz") direction = "z";
      } else if (localAxis.x.x === 0 && localAxis.x.y === 0) {
        // z軸に平行
        if (direction === "gx") {
          direction = "y";
          P1 = -P1;
          P2 = -P2;
        }
        if (direction === "gy") direction = "z";
        if (direction === "gz") {
          direction = "x";
          P1 = -P1;
          P2 = -P2;
        }
      }

      const niNo = m.ni.toString();
      const njNo = m.nj.toString();

      let arrow: LoadData = undefined;
      switch (load.mark) {
        case 1:
          // 集中荷重
          arrow = ThreeLoadMemberPoint.create(mNo, niNo, njNo, nodei, nodej, load.mark, direction, load.L1, load.L2, P1, P2, localAxis, load.row, originalDirection);
          break;
        case 2:
          switch (direction) {
            case "x":
              // 軸方向分布荷重
              arrow = ThreeLoadAxial.create(mNo, niNo, njNo, nodei, nodej, load.mark, direction, load.L1, load.L2, P1, P2, localAxis, load.row);
              break;
            case "y":
            case "z":
            case "gx":
            case "gy":
            case "gz":
              // 分布荷重
              arrow = ThreeLoadDistribute.create(mNo, niNo, njNo, nodei, nodej, load.mark, direction, load.L1, load.L2, P1, P2, localAxis, load.row, originalDirection);
              break;
            case "r":
              // ねじりモーメント荷重
              arrow = ThreeLoadTorsion.create(mNo, niNo, njNo, nodei, nodej, load.mark, direction, load.L1, load.L2, P1, P2, localAxis, load.row);
              break;
            default:
              // 無視
              break;
          }
          break;
        case 9:
          // 温度荷重
          arrow = ThreeLoadTemperature.create(mNo, niNo, njNo, nodei, nodej, load.mark, P1, localAxis, load.row);
          break;
        case 11:
          // 集中モーメント荷重
          arrow = ThreeLoadMemberMoment.create(mNo, niNo, njNo, nodei, nodej, load.mark, direction, load.L1, load.L2, P1, P2, localAxis, load.row, originalDirection);
          break;
        default:
          // 無視
          break;
      }
      if (!arrow) {
        continue;
      }

      memberLoadList.push(arrow);
      ThreeObject.add(arrow);
    } 
  }

  /**
   * 荷重の種類ごとの最大値を調べる
   * @param targetCase 対象データのケース番号
   */
  private updateMaxLoad(targetCase: string) {
    const caseData = this.AllCaseLoadList[targetCase];

    ["pMax", "mMax", "wMax", "rMax", "qMax"].forEach((id) => {
      caseData.maxLoadDict[id] = caseData.loadList.map((load) => load[id] as number).reduce((a, b) => Math.max(a, b), 0);
    });
  }

  /**
   * 荷重データの並び替え
   * @param targetCase 対象データのケース番号。undefinedの場合は全てのケースが対象 @default this.currentIndex
   */
  private loadListSort(targetCase: string = this.currentIndex) {
    for (const caseStr of Object.keys(this.AllCaseLoadList)) {
      if (targetCase !== undefined && targetCase !== caseStr) {
        continue;
      }
      const caseData = this.AllCaseLoadList[caseStr];
      caseData.loadList.sort((a, b) => {
        if (a.rank < b.rank) {
          return -1;
        } else if (a.rank === b.rank) {
          return a.row - b.row;
        } else {
          return 1;
        }
      });
    }
  }

  // three.service から呼ばれる 表示・非表示の制御
  public visibleChange(flag: boolean, gui: boolean): void {
    // 非表示にする
    if (flag === false) {
      this.guiDisable();
      this.changeCase(-1);
      this.isVisible.object = false;
      return;
    }

    // gui の表示を切り替える
    if (gui === true) {
      this.guiEnable();
      //console.log('荷重強度の入力です。')
    } else {
      // 黒に戻す
      this.guiDisable();
      // setColor を初期化する
      //console.log('荷重名称の入力です。')
      this.selectChange(-1, '');
    }
    this.isVisible.gui = gui;

    // すでに表示されていたら変わらない
    if (this.isVisible.object === true) {
      return;
    }

    // 表示する
    this.changeCase(1);
    this.isVisible.object = true;
  }

  // #region gui制御と描画スケール

  /** guiが無効な間の描画スケール値の退避先 */
  private _loadScale = 100;
  /** dat.gui.NumberControllerSlider */
  private gui:any = {};

  /**
   * 描画スケール値
   */
  private get LoadScale(): number {
    if ("LoadScale" in this.gui) {
      // guiが有効な間はguiの値を参照
      return this.gui.LoadScale.getValue();
    } else {
      // guiが無効な間は退避されている値を参照
      return this._loadScale;
    }
  }

  /**
   * guiの有効化
   */
  private guiEnable(): void {
    if (!("LoadScale" in this.gui)) {
      const gui_step: number = 1;
      this.gui["LoadScale"] = this.scene.gui
        .add({ LoadScale: this._loadScale }, "LoadScale", 0, 400)
        .step(gui_step)
        .onChange((value) => {
          this.onResize();
          this.scene.render();
        });
      this.languagesService.tranText();
    }
  }

  /**
   * guiの無効化
   */
  private guiDisable(): void {
    for (const key of Object.keys(this.gui)) {
      if (key === "LoadScale") {
        // 描画スケール値を退避
        this._loadScale = this.gui.LoadScale.getValue();
      }
      this.scene.gui.remove(this.gui[key]);
    }
    this.gui = {};
  }

  // #endregion gui制御と描画スケール

  private baseScale(): number {
    return this.nodeThree.baseScale * 10;
  }

  /**
   * 描画スケールの変更に伴う全荷重の再描画
   * @param id 処理対象のケース番号
   */
  private onResize(id: string = this.currentIndex): void {
    if (!(id in this.AllCaseLoadList)) {
      return;
    }

    const caseData = this.AllCaseLoadList[id];
    if (caseData === undefined) {
      return;
    }

    const scale1: number = this.LoadScale / 100;
    const scale2: number = this.baseScale();
    let scale: number = scale1 * scale2;

    // 荷重データの再ソートは不要

    // 節点番号と部材番号の抽出
    const totalNodeNoList = Array.from(new Set(Array.prototype.concat(...caseData.loadList.map(load => load.correspondingNodeNoList))));
    const totalMemberNoList = Array.from(new Set(Array.prototype.concat(...caseData.loadList.map(load => load.correspondingMemberNoList))));

    // 全ての節点と部材のoffsetDict初期化
    const nodeOffsetDictMap = new Map(totalNodeNoList.map(no => [no, new OffsetDict()]));
    const memberOffsetDictMap = new Map(totalMemberNoList.map(no => {
      const localAxis = caseData.localAxisDict[no];
      return [no, new OffsetDict(localAxis)];
    }));

    // 全荷重の再描画
    for (const load of caseData.loadList) {
      load.relocate(nodeOffsetDictMap, memberOffsetDictMap, caseData.maxLoadDict, scale, undefined);
    }

    //this.scene.render(); //コメントアウト：レンダリング不要の場合があるため、レンダリングはこの関数の外側で行う
  }

  // 重なりを調整する
  private setOffset(id: string = this.currentIndex): void {
    // if (!(id in this.AllCaseLoadList)) {
    //   return;
    // }
    // const loadList = this.AllCaseLoadList[id];

    // // 配置位置（その他の荷重とぶつからない位置）を決定する
    // for (const n of Object.keys(loadList.pointLoadList)) {
    //   const list = loadList.pointLoadList[n];
    //   // 集中荷重:ThreeLoadPoint
    //   ["tx", "ty", "tz"].forEach((k) => {
    //     let offset1 = 0;
    //     let offset2 = 0;
    //     for (const item of list[k]) {
    //       const editor = item.editor;
    //       // 大きさを変更する
    //       const scale: number =
    //         4 * this.helper.getCircleScale(Math.abs(item.value), loadList.pMax);
    //       editor.setSize(item, scale);
    //       // オフセットする
    //       if (item.value > 0) {
    //         editor.setOffset(item, offset1);
    //         offset1 -= scale * 1.0; // オフセット距離に高さを加算する
    //       } else {
    //         editor.setOffset(item, offset2);
    //         offset2 += scale * 1.0; // オフセット距離に高さを加算する
    //       }
    //     }
    //   });
    //   // 集中荷重:ThreeLoadPoint
    //   ["rx", "ry", "rz"].forEach((k) => {
    //     let offset = 0;
    //     for (const item of list[k]) {
    //       const editor = item.editor;
    //       const scale: number = this.helper.getCircleScale(item.value, loadList.mMax);
    //       editor.setSize(item, scale);
    //       editor.setOffset(item, offset);
    //       offset += this.baseScale() * 0.1;
    //     }
    //   });
    // }

    // // 要素荷重のスケールを変更する
    // for (const m of Object.keys(loadList.memberLoadList)) {
    //   const list = loadList.memberLoadList[m];

    //   // ねじりモーメント
    //   let offset0 = 0;
    //   for (const item of list["r"]) {
    //     const editor = item.editor;

    //     if (item.name.indexOf(ThreeLoadMemberMoment.id) !== -1) {
    //       const scale: number = this.helper.getCircleScale(
    //         Math.abs(item.value),
    //         loadList.mMax
    //       );
    //       editor.setSize(item, scale);
    //     } else if (item.name.indexOf(ThreeLoadTorsion.id) !== -1) {
    //       // 大きさを変更する
    //       const scale: number = this.helper.getScale(
    //         Math.abs(item.value),
    //         loadList.rMax
    //       );
    //       editor.setSize(item, scale);
    //       offset0 += scale * 0.5;
    //     }
    //   }

    //   // // 分布荷重（部材軸座標方向）
    //   // ["y", "z"].forEach((k) => {
    //   //   let offset1 = offset0;
    //   //   let offset2 = offset0 * -1;
    //   //   //let offset3 = offset0;
    //   //   //let offset4 = offset0 * -1;

    //   //   const Xarea1 = []; // 既存荷重の頂点配列
    //   //   list[k].forEach((item) => {
    //   //     const editor = item.editor;
    //   //     // 大きさを変更する
    //   //     if (item.name.indexOf(ThreeLoadDistribute.id) !== -1) {
    //   //       // 分布荷重
    //   //       const scale: number = this.helper.getScale(
    //   //         Math.abs(item.value),
    //   //         loadList.wMax
    //   //       );
    //   //       editor.setSize(item, scale);
    //   //       // P1とP2の符号が異なる場合の補正値を入手
    //   //       let offset3: number = 0;
    //   //       //以降は当たり判定に用いる部分
    //   //       const vertice_points = []; // 新規荷重の頂点配列
    //   //       //当たり判定のエリアを登録
    //   //       const target_geo =
    //   //         item.children[0].children[0].children[0].geometry;
    //   //       const pos_arr = target_geo.attributes.position.array;
    //   //       for (let i = 0; i < pos_arr.length; i += 3) {
    //   //         const scale = this.helper.getScale(
    //   //           Math.abs(item.value),
    //   //           loadList.wMax
    //   //         );
    //   //         vertice_points.push(pos_arr[i]); // x
    //   //         vertice_points.push(pos_arr[i + 1] * scale); // y
    //   //       }
    //   //       // P1とP2がねじれた荷重は、当たり判定の範囲を大きくする
    //   //       if (item.P1 * item.P2 < 0) {
    //   //         if (item.P2 > 0) {
    //   //           if (item.P2 === item.value) {
    //   //             offset3 = vertice_points[3];
    //   //             const s = vertice_points[3] * (-1);
    //   //             for (let n = 1; n < 18; n+=2) {
    //   //               vertice_points[n] += s;
    //   //             } 
    //   //           } else {
    //   //             offset3 = vertice_points[9];
    //   //             const s = vertice_points[9];
    //   //             for (let n = 1; n < 18; n+=2) {
    //   //               vertice_points[n] -= s;
    //   //             } 
    //   //           }
    //   //         } else {
    //   //           if (item.P1 !== item.value) {
    //   //             offset3 = vertice_points[3];
    //   //             const s = vertice_points[3];
    //   //             for (let n = 1; n < 18; n+=2) {
    //   //               vertice_points[n] -= s;
    //   //             } 
    //   //           } else {
    //   //             offset3 = vertice_points[9];
    //   //             const s = vertice_points[9] * (-1);
    //   //             for (let n = 1; n < 18; n+=2) {
    //   //               vertice_points[n] += s;
    //   //             } 
    //   //           }
    //   //         }
    //   //       }

    //   //       const Xarea2 = [];
    //   //       //既存の荷重を全て調べ、xについての接触リストを作成する
    //   //       for (let hit_points of Xarea1) {

    //   //         //接触判定
    //   //         let judgeX = this.self_raycaster(vertice_points, hit_points, "x");

    //   //         // X方向において当たり判定があった範囲（hit_points）を記録する。
    //   //         if (judgeX === "Hit") {
    //   //           // 当たり判定の上面の中で、最も絶対値が多い値を探す
    //   //           let maxY = Math.max( Math.abs(hit_points[3]), 
    //   //                                Math.abs(hit_points[5]), 
    //   //                                Math.abs(hit_points[7]) );
    //   //           // maxYの符号を絶対値が大きい方に合わせる
    //   //           if (Math.abs( hit_points[3] ) <= Math.abs( hit_points[7] )) {
    //   //             maxY = Math.sign( hit_points[7] ) * maxY;
    //   //           } else {
    //   //             maxY = Math.sign( hit_points[3] ) * maxY;
    //   //           }
    //   //           // offset値と荷重を登録する
    //   //           Xarea2.push( [maxY, item.value] );
    //   //         }

    //   //       }

    //   //       // hitAreaの該当項目を参照して、offset距離を入手する。
    //   //       let maxOffset_plus: number = 0;
    //   //       let maxOffset_minus: number = 0;
    //   //       for (const point of Xarea2) {
    //   //         const height = point[0];
    //   //         const value = point[1];
    //   //         if (value > 0) {
    //   //           maxOffset_plus = (maxOffset_plus > height) ? maxOffset_plus : height;
    //   //         } else {
    //   //           maxOffset_minus = (maxOffset_minus < height) ? maxOffset_minus : height;
    //   //         }
    //   //       }
    //   //       // オフセットを反映させる, vertice_pointsのy座標を調整する
    //   //       if (item.value > 0) {
    //   //         // offset0とmaxOffset_plusの和が総オフセット距離
    //   //         offset1 += maxOffset_plus - offset3;
    //   //         editor.setOffset(item, offset1);
    //   //         for (let num = 1; num < 18; num+=2) {
    //   //           vertice_points[num] += maxOffset_plus;
    //   //         }
    //   //       } else {
    //   //         // offset0とmaxOffset_minusの和が総オフセット距離
    //   //         offset2 += maxOffset_minus - offset3;
    //   //         editor.setOffset(item, offset2);
    //   //         for (let num = 1; num < 18; num+=2) {
    //   //           vertice_points[num] += maxOffset_minus;
    //   //         }
    //   //       }

    //   //       // ここでprescale分かける？
    //   //       Xarea1.push([
    //   //         vertice_points[0],
    //   //         vertice_points[1],
    //   //         vertice_points[2],
    //   //         vertice_points[3],
    //   //         vertice_points[4],
    //   //         vertice_points[5],
    //   //         vertice_points[8],
    //   //         vertice_points[9],
    //   //         vertice_points[10],
    //   //         vertice_points[11],
    //   //         item.value,
    //   //       ]); //メッシュの5点の2次元座標と，valueの値を保存する

    //   //       offset1 = offset0;
    //   //       offset2 = offset0 * -1;
    //   //     } else if (item.name.indexOf(ThreeLoadMemberPoint.id) !== -1) {
    //   //       // 集中荷重
    //   //       const scale: number = this.helper.getCircleScale(
    //   //         Math.abs(item.value),
    //   //         loadList.pMax
    //   //       );
    //   //       editor.setSize(item, scale);

    //   //       // ここで当たり判定を実行する
    //   //       const vertice_points = []; // 新規荷重の頂点配列
    //   //       //当たり判定のエリアを登録
    //   //       const target_geo =
    //   //         item.children[0].children[0];
    //   //       const pos_arr = target_geo.position;

    //   //       // 部材途中集中荷重の当たり判定幅, とりあえずで設定
    //   //       const width = item.L / this.baseScale() / 100;
    //   //       // 分布荷重に合わせる (memo：123, 345, 135)
    //   //       vertice_points.push(pos_arr.x - width); // x1
    //   //       vertice_points.push(0); // y1
    //   //       vertice_points.push(pos_arr.x - width); // x2
    //   //       vertice_points.push(Math.sign(item.value) * scale); // y2
    //   //       vertice_points.push(pos_arr.x); // x3
    //   //       vertice_points.push(Math.sign(item.value) * scale); // y3
    //   //       vertice_points.push(pos_arr.x); // x3
    //   //       vertice_points.push(Math.sign(item.value) * scale); // y3
    //   //       vertice_points.push(pos_arr.x + width); // x4
    //   //       vertice_points.push(Math.sign(item.value) * scale); // y4
    //   //       vertice_points.push(pos_arr.x + width); // x5
    //   //       vertice_points.push(0); // y5
    //   //       vertice_points.push(pos_arr.x - width); // x1
    //   //       vertice_points.push(0); // y1
    //   //       vertice_points.push(pos_arr.x); // x3
    //   //       vertice_points.push(Math.sign(item.value) * scale); // y3
    //   //       vertice_points.push(pos_arr.x + width); // x5
    //   //       vertice_points.push(0); // y5
    //   //       //}
    //   //       if (Xarea1.length === 0) {
    //   //         if (item.value > 0) {
    //   //           editor.setOffset(item, offset1);
    //   //         } else {
    //   //           editor.setOffset(item, offset2);
    //   //         }
    //   //       }

    //   //       const Xarea2 = [];
    //   //       //既存の荷重を全て調べ、xについての接触リストを作成する
    //   //       for (let hit_points of Xarea1) {

    //   //         //接触判定
    //   //         let judgeX = this.self_raycaster(vertice_points, hit_points, "x");

    //   //         // X方向において当たり判定があった範囲（hit_points）を記録する。
    //   //         if (judgeX === "Hit") {
    //   //           // 当たり判定の上面の中で、最も絶対値が多い値を探す
    //   //           let maxY = Math.max( Math.abs(hit_points[3]), 
    //   //                                Math.abs(hit_points[5]), 
    //   //                                Math.abs(hit_points[7]) );
    //   //           // maxYの符号を合わせる
    //   //           maxY = Math.sign( hit_points[5] ) * maxY;
    //   //           // offset値と荷重を登録する
    //   //           Xarea2.push( [maxY, item.value] );
    //   //         }

    //   //       }

    //   //       // Xarea2の該当項目を参照して、offset距離を入手する。
    //   //       let maxOffset_plus: number = 0;
    //   //       let maxOffset_minus: number = 0;
    //   //       for (const point of Xarea2) {
    //   //         const height = point[0];
    //   //         const value = point[1];
    //   //         if (value > 0) {
    //   //           maxOffset_plus = (maxOffset_plus > height) ? maxOffset_plus : height;
    //   //         } else {
    //   //           maxOffset_minus = (maxOffset_minus < height) ? maxOffset_minus : height;
    //   //         }
    //   //       }
    //   //       // オフセットを反映させる, vertice_pointsのy座標を調整する
    //   //       if (item.value > 0) {
    //   //         offset1 += maxOffset_plus;
    //   //         editor.setOffset(item, offset1);
    //   //         for (let num = 1; num < 18; num+=2) {
    //   //           vertice_points[num] += maxOffset_plus
    //   //         }
    //   //       } else {
    //   //         offset2 += maxOffset_minus;
    //   //         editor.setOffset(item, offset2);
    //   //         for (let num = 1; num < 18; num+=2) {
    //   //           // 前の変更情報が残っている？
    //   //           vertice_points[num] += maxOffset_minus;
    //   //         }
    //   //       }

    //   //       // ここでprescale分かける？
    //   //       Xarea1.push([
    //   //         vertice_points[0],
    //   //         vertice_points[1],
    //   //         vertice_points[2],
    //   //         vertice_points[3],
    //   //         vertice_points[4],
    //   //         vertice_points[5],
    //   //         vertice_points[8],
    //   //         vertice_points[9],
    //   //         vertice_points[10],
    //   //         vertice_points[11],
    //   //         item.value,
    //   //       ]); //メッシュの5点の2次元座標と，valueの値を保存する

    //   //       offset1 = offset0;
    //   //       offset2 = offset0 * -1;
    //   //     }
    //   //   });
    //   // });

    //   // // 分布荷重（絶対座標方向）
    //   // ["gx", "gy", "gz"].forEach((k) => {
    //   //   let offset1 = offset0;
    //   //   let offset2 = offset0;
    //   //   list[k].forEach((item) => {
    //   //     const editor = item.editor;

    //   //     // 大きさを変更する
    //   //     if (item.name.indexOf(ThreeLoadDistribute.id) !== -1) {
    //   //       // 分布荷重
    //   //       const scale: number = this.helper.getScale(
    //   //         Math.abs(item.value),
    //   //         loadList.wMax
    //   //       );
    //   //       editor.setSize(item, scale);
    //   //       // オフセットする
    //   //       if (item.value > 0) {
    //   //         editor.setGlobalOffset(item, offset1, k);
    //   //         offset1 += scale * 1.0; // オフセット距離に高さを加算する
    //   //       } else {
    //   //         editor.setGlobalOffset(item, offset2, k);
    //   //         offset2 -= scale * 1.0; // オフセット距離に高さを加算する
    //   //       }
    //   //     } else if (item.name.indexOf(ThreeLoadMemberPoint.id) !== -1) {
    //   //       // 集中荷重
    //   //       const scale: number = this.helper.getCircleScale(
    //   //         Math.abs(item.value),
    //   //         loadList.pMax
    //   //       );
    //   //       editor.setSize(item, scale);
    //   //       // オフセットする
    //   //       // if (item.value > 0) {
    //   //       //   editor.setGlobalOffset(item, offset1, k);
    //   //       //   offset1 += scale * 1.0; // オフセット距離に高さを加算する
    //   //       // } else {
    //   //       //   editor.setGlobalOffset(item, offset2, k);
    //   //       //   offset2 -= scale * 1.0; // オフセット距離に高さを加算する
    //   //       // }
    //   //     }
    //   //   });
    //   // });

    //   // 部材軸方向荷重
    //   list["x"].forEach((item) => {
    //     const editor = item.editor;
    //     // 大きさを変更する
    //     if (item.name.indexOf(ThreeLoadMemberPoint.id) !== -1) {
    //       const scale: number = this.helper.getCircleScale(
    //         Math.abs(item.value),
    //         loadList.pMax
    //       );
    //       editor.setSize(item, scale);
    //     } else if (item.name.indexOf(ThreeLoadAxial.id) !== -1) {
    //       const scale: number = this.helper.getScale(
    //         Math.abs(item.value),
    //         loadList.qMax
    //       );
    //       editor.setSize(item, scale);
    //     }
    //   });
    // }
  }

  // 当たり判定を行う
  private self_raycaster(points, area, pattern: string) {
    const d = 0.001; //当たり判定の緩和値

    // 接触判定->結果はjudgeで返す
    let judge: string = "";
    // newLoadは追加面。oldLoadは既存面。判定緩和で追加面を小さくする。全て矩形とみなす
    const newLoad = {
      leftX: points[2],
      rightX: points[8],
      topY: Math.max(points[1], points[3], points[9], points[17]),
      bottomY: Math.min(points[1], points[3], points[9], points[17]),
    };
    const oldLoad = {
      leftX: area[2],
      rightX: area[6],
      topY: Math.max(area[1], area[3], area[7], area[9]),
      bottomY: Math.min(area[1], area[3], area[7], area[9]),
    };
    // pointsは追加面、areaは既存面を示す。
    switch (pattern) {
      case "x":
        // 追加面のサイズを調整し、当たり判定を緩和する。
        if (
          oldLoad.leftX < newLoad.leftX - d &&
          newLoad.leftX + d < oldLoad.rightX
        ) {
          judge = "Hit"; //荷重の左側が既存面の内部にある状態
        } else if (
          oldLoad.leftX < newLoad.rightX - d &&
          newLoad.rightX + d < oldLoad.rightX
        ) {
          judge = "Hit"; //荷重の右側が既存面の内部にある状態
        } else if (
          newLoad.leftX - d < oldLoad.leftX &&
          newLoad.leftX - d < oldLoad.rightX &&
          newLoad.rightX + d > oldLoad.leftX &&
          newLoad.rightX + d > oldLoad.rightX
        ) {
          judge = "Hit"; //荷重の面が既存の面を全て含む状態
        } else {
          judge = "NotHit";
        }
        break;
      case "y":
        if (
          oldLoad.bottomY < newLoad.bottomY &&
          newLoad.bottomY < oldLoad.topY
        ) {
          judge = "Hit"; //荷重の下側が既存面の内部にある状態
        } else if (
          oldLoad.bottomY < newLoad.topY &&
          newLoad.topY < oldLoad.topY
        ) {
          judge = "Hit"; //荷重の上側が既存面の内部にある状態
        } else if (
          newLoad.bottomY <= oldLoad.bottomY &&
          newLoad.bottomY <= oldLoad.topY &&
          newLoad.topY >= oldLoad.bottomY &&
          newLoad.topY >= oldLoad.topY
        ) {
          judge = "Hit"; //荷重の面が既存の面を全て含む状態
        } else {
          judge = "NotHit";
        }
        break;
    }

    return judge;
  }

  // マウス位置とぶつかったオブジェクトを検出する
  public detectObject(raycaster: THREE.Raycaster, action: string): void {
    return; // マウスの位置と 当たり判定の位置が ずれてる・・・使いにくいので
    if (!(this.currentIndex in this.AllCaseLoadList)) {
      this.selecteddObject = null;
      return; // 対象がなければ何もしない
    }

    const targetLoad = this.AllCaseLoadList[this.currentIndex];
    const ThreeObject: THREE.Object3D = targetLoad.ThreeObject;

    // 交差しているオブジェクトを取得
    const intersects = raycaster.intersectObjects(ThreeObject.children, true);
    if (intersects.length <= 0) {
      return;
    }

    // マウス位置とぶつかったオブジェクトの親を取得
    const item: any = this.getParent(intersects[0].object);
    if (item === null) {
      return;
    }

    if (action === "hover") {
      if (this.selecteddObject !== null) {
        if (this.selecteddObject === item) {
          return;
        }
      }
    }

    // 全てのハイライトを元に戻す
    this.selectChange(-1, '');

    //全てのオブジェクトをデフォルトの状態にする
    if (!("editor" in item)) {
      return;
    }

    this.selecteddObject = item;

    const editor: any = item["editor"];
    editor.setColor(item, action);

    this.scene.render();
  }

  // マウス位置とぶつかったオブジェクトの親を取得
  private getParent(item): any {
    if (!("name" in item)) {
      return null;
    }

    for (const key of Object.keys(this.loadEditor)) {
      if (item.name.indexOf(key) !== -1) {
        return item;
      }
    }

    if (!("parent" in item)) {
      return null;
    }

    return this.getParent(item.parent);
  }

  public rotateAngle(group: THREE.Group, codeAngle: number){
      group.rotateX((codeAngle * Math.PI) / 180)
  }
}
