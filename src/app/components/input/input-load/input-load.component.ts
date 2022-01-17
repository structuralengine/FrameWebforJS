import { Component, OnInit, ViewChild } from "@angular/core";
import { InputLoadService } from "./input-load.service";
import { DataHelperModule } from "../../../providers/data-helper.module";
import { ThreeService } from "../../three/three.service";
import { SheetComponent } from "../sheet/sheet.component";
import pq from "pqgrid";
import { AppComponent } from "src/app/app.component";
import { FormControl, FormGroup } from "@angular/forms";
import { ThreeLoadService } from "../../three/geometry/three-load/three-load.service";
import { SceneService } from "../../three/scene.service";

@Component({
  selector: "app-input-load",
  templateUrl: "./input-load.component.html",
  styleUrls: ["./input-load.component.scss", "../../../app.component.scss"],
})
export class InputLoadComponent implements OnInit {
  @ViewChild("grid") grid: SheetComponent;

  public load_name: string;
  public LL_flg: boolean = false;

  public LL_pitch: number;

  private dataset = [];
  private columnHeaders3D = [
    {
      title: "要素荷重",
      align: "center",
      colModel: [
        {
          title: "部材No",
          align: "center",
          colModel: [
            {
              title: "1",
              align: "center",
              dataType: "string",
              dataIndx: "m1",
              sortable: false,
              width: 30,
            },
            {
              title: "2",
              align: "center",
              dataType: "string",
              dataIndx: "m2",
              sortable: false,
              width: 30,
            },
          ],
        },
        {
          title: "方向",
          align: "center",
          colModel: [
            {
              title: "(x,y,z)",
              dataType: "string",
              dataIndx: "direction",
              sortable: false,
              width: 30,
            },
          ],
        },
        {
          title: "マーク",
          align: "center",
          colModel: [
            {
              title: "(1,2,9,11)",
              dataType: "integer",
              dataIndx: "mark",
              sortable: false,
              width: 60,
            },
          ],
        },
        {
          title: "L1",
          align: "center",
          colModel: [
            {
              title: "(m)",
              dataType: "string",
              align: "right",
              dataIndx: "L1",
              sortable: false,
              width: 70,
              format: (val) => {
                const num = this.helper.toNumber(val);
                if (num === null) return null;
                const str = val.toString();
                if (num === 0 && str.charAt(0) === "-") {
                  return "-0.000";
                } else {
                  return num.toFixed(3);
                }
              },
            },
          ],
        },
        {
          title: "L2",
          align: "center",
          colModel: [
            {
              title: "(m)",
              dataType: "float",
              format: "#.000",
              dataIndx: "L2",
              sortable: false,
              width: 70,
            },
          ],
        },
        {
          title: "P1",
          align: "center",
          colModel: [
            {
              title: "(kN/m)",
              dataType: "float",
              format: "#.00",
              dataIndx: "P1",
              sortable: false,
              width: 70,
            },
          ],
        },
        {
          title: "P2",
          align: "center",
          colModel: [
            {
              title: "(kN/m)",
              dataType: "float",
              format: "#.00",
              dataIndx: "P2",
              sortable: false,
              width: 70,
            },
          ],
        },
      ],
    },
    {
      title: "節点荷重",
      align: "center",
      colModel: [
        {
          title: "節点",
          align: "center",
          colModel: [
            {
              title: "No",
              align: "center",
              dataType: "string",
              dataIndx: "n",
              sortable: false,
              width: 30,
            },
          ],
        },
        {
          title: "X",
          align: "center",
          colModel: [
            {
              title: "(kN)",
              dataType: "float",
              format: "#.00",
              dataIndx: "tx",
              sortable: false,
              width: 70,
            },
          ],
        },
        {
          title: "Y",
          align: "center",
          colModel: [
            {
              title: "(kN)",
              dataType: "float",
              format: "#.00",
              dataIndx: "ty",
              sortable: false,
              width: 70,
            },
          ],
        },
        {
          title: "Z",
          align: "center",
          colModel: [
            {
              title: "(kN)",
              dataType: "float",
              format: "#.00",
              dataIndx: "tz",
              sortable: false,
              width: 70,
            },
          ],
        },
        {
          title: "RX",
          align: "center",
          colModel: [
            {
              title: "(kN m)",
              dataType: "float",
              format: "#.00",
              dataIndx: "rx",
              sortable: false,
              width: 70,
            },
          ],
        },
        {
          title: "RY",
          align: "center",
          colModel: [
            {
              title: "(kN m)",
              dataType: "float",
              format: "#.00",
              dataIndx: "ry",
              sortable: false,
              width: 70,
            },
          ],
        },
        {
          title: "RZ",
          align: "center",
          colModel: [
            {
              title: "(kN m)",
              dataType: "float",
              format: "#.00",
              dataIndx: "rz",
              sortable: false,
              width: 70,
            },
          ],
        },
      ],
    },
  ];
  private columnHeaders2D = [
    {
      title: "要素荷重",
      align: "center",
      colModel: [
        {
          title: "部材No",
          colModel: [
            {
              title: "1",
              align: "center",
              dataType: "string",
              dataIndx: "m1",
              sortable: false,
              width: 30,
            },
            {
              title: "2",
              align: "center",
              dataType: "string",
              dataIndx: "m2",
              sortable: false,
              width: 30,
            },
          ],
        },
        {
          title: "方向",
          align: "center",
          colModel: [
            {
              title: "(x,y,z)",
              dataType: "string",
              dataIndx: "direction",
              sortable: false,
              width: 30,
            },
          ],
        },
        {
          title: "マーク",
          align: "center",
          colModel: [
            {
              title: "(1,2,9,11)",
              dataType: "integer",
              dataIndx: "mark",
              sortable: false,
              width: 60,
            },
          ],
        },
        {
          title: "L1",
          align: "center",
          colModel: [
            {
              title: "(m)",
              dataType: "string",
              align: "right",
              dataIndx: "L1",
              sortable: false,
              width: 70,
              format: (val) => {
                const num = this.helper.toNumber(val);
                if (num === null) return null;
                const str = val.toString();
                if (num === 0 && str.charAt(0) === "-") {
                  return "-0.000";
                } else {
                  return num.toFixed(3);
                }
              },
            },
          ],
        },
        {
          title: "L2",
          align: "center",
          colModel: [
            {
              title: "(m)",
              dataType: "float",
              format: "#.000",
              dataIndx: "L2",
              sortable: false,
              width: 70,
            },
          ],
        },
        {
          title: "P1",
          align: "center",
          colModel: [
            {
              title: "(kN/m)",
              dataType: "float",
              format: "#.00",
              dataIndx: "P1",
              sortable: false,
              width: 70,
            },
          ],
        },
        {
          title: "P2",
          align: "center",
          colModel: [
            {
              title: "(kN/m)",
              dataType: "float",
              format: "#.00",
              dataIndx: "P2",
              sortable: false,
              width: 70,
            },
          ],
        },
      ],
    },
    {
      title: "節点荷重",
      align: "center",
      dataIndx: "ddd",
      colModel: [
        {
          title: "節点",
          align: "center",
          colModel: [
            {
              title: "No",
              align: "center",
              dataType: "string",
              dataIndx: "n",
              sortable: false,
              width: 30,
            },
          ],
        },
        {
          title: "X",
          align: "center",
          colModel: [
            {
              title: "(kN)",
              dataType: "float",
              format: "#.00",
              dataIndx: "tx",
              sortable: false,
              width: 70,
            },
          ],
        },
        {
          title: "Y",
          align: "center",
          colModel: [
            {
              title: "(kN)",
              dataType: "float",
              format: "#.00",
              dataIndx: "ty",
              sortable: false,
              width: 70,
            },
          ],
        },
        {
          title: "M",
          align: "center",
          colModel: [
            {
              title: "(kN m)",
              dataType: "float",
              format: "#.00",
              dataIndx: "rz",
              sortable: false,
              width: 70,
            },
          ],
        },
      ],
    },
  ];
  // 3次元の連行荷重
  private columnHeaders3D_LL = [
    {
      title: "要素荷重",
      align: "center",
      colModel: [
        {
          title: "部材No",
          align: "center",
          colModel: [
            {
              title: "1",
              align: "center",
              dataType: "string",
              dataIndx: "m1",
              sortable: false,
              width: 30,
            },
            {
              title: "2",
              align: "center",
              dataType: "string",
              dataIndx: "m2",
              sortable: false,
              width: 30,
            },
          ],
        },
        {
          title: "方向",
          align: "center",
          colModel: [
            {
              title: "(x,y,z)",
              dataType: "string",
              dataIndx: "direction",
              sortable: false,
              width: 30,
            },
          ],
        },
        {
          title: "マーク",
          align: "center",
          colModel: [
            {
              title: "(1,2,9,11)",
              dataType: "integer",
              dataIndx: "mark",
              sortable: false,
              width: 60,
            },
          ],
        },
        {
          title: "L1",
          align: "center",
          colModel: [
            {
              title: "(m)",
              dataType: "string",
              align: "right",
              dataIndx: "L1",
              sortable: false,
              width: 70,
              format: (val) => {
                const num = this.helper.toNumber(val);
                if (num === null) return null;
                const str = val.toString();
                if (num === 0 && str.charAt(0) === "-") {
                  return "-0.000";
                } else {
                  return num.toFixed(3);
                }
              },
            },
          ],
        },
        {
          title: "L2",
          align: "center",
          colModel: [
            {
              title: "(m)",
              dataType: "float",
              format: "#.000",
              dataIndx: "L2",
              sortable: false,
              width: 70,
            },
          ],
        },
        {
          title: "P1",
          align: "center",
          colModel: [
            {
              title: "(kN/m)",
              dataType: "float",
              format: "#.00",
              dataIndx: "P1",
              sortable: false,
              width: 70,
            },
          ],
        },
        {
          title: "P2",
          align: "center",
          colModel: [
            {
              title: "(kN/m)",
              dataType: "float",
              format: "#.00",
              dataIndx: "P2",
              sortable: false,
              width: 70,
            },
          ],
        },
      ],
    },
  ];
  // 2次元の連行荷重
  private columnHeaders2D_LL = [
    {
      title: "要素荷重",
      align: "center",
      colModel: [
        {
          title: "部材No",
          colModel: [
            {
              title: "1",
              align: "center",
              dataType: "string",
              dataIndx: "m1",
              sortable: false,
              width: 30,
            },
            {
              title: "2",
              align: "center",
              dataType: "string",
              dataIndx: "m2",
              sortable: false,
              width: 30,
            },
          ],
        },
        {
          title: "方向",
          align: "center",
          colModel: [
            {
              title: "(x,y,z)",
              dataType: "string",
              dataIndx: "direction",
              sortable: false,
              width: 30,
            },
          ],
        },
        {
          title: "マーク",
          align: "center",
          colModel: [
            {
              title: "(1,2,9,11)",
              dataType: "integer",
              dataIndx: "mark",
              sortable: false,
              width: 60,
            },
          ],
        },
        {
          title: "L1",
          align: "center",
          colModel: [
            {
              title: "(m)",
              dataType: "string",
              align: "right",
              dataIndx: "L1",
              sortable: false,
              width: 70,
              format: (val) => {
                const num = this.helper.toNumber(val);
                if (num === null) return null;
                const str = val.toString();
                if (num === 0 && str.charAt(0) === "-") {
                  return "-0.000";
                } else {
                  return num.toFixed(3);
                }
              },
            },
          ],
        },
        {
          title: "L2",
          align: "center",
          colModel: [
            {
              title: "(m)",
              dataType: "float",
              format: "#.000",
              dataIndx: "L2",
              sortable: false,
              width: 70,
            },
          ],
        },
        {
          title: "P1",
          align: "center",
          colModel: [
            {
              title: "(kN/m)",
              dataType: "float",
              format: "#.00",
              dataIndx: "P1",
              sortable: false,
              width: 70,
            },
          ],
        },
        {
          title: "P2",
          align: "center",
          colModel: [
            {
              title: "(kN/m)",
              dataType: "float",
              format: "#.00",
              dataIndx: "P2",
              sortable: false,
              width: 70,
            },
          ],
        },
      ],
    },
  ];

  private ROWS_COUNT = 15;
  private page = 1;

  constructor(
    private data: InputLoadService,
    private helper: DataHelperModule,
    private app: AppComponent,
    private three: ThreeService,
    private threeLoad: ThreeLoadService,
    private scene: SceneService
  ) {}

  ngOnInit() {
    this.ROWS_COUNT = this.rowsCount();
    const load_name = this.data.getLoadNameColumns(1);
    this.load_name = load_name.name;
    this.checkLL(load_name.symbol);

    this.loadPage(1, this.ROWS_COUNT);

    this.three.ChangeMode("load_values");
    this.three.ChangePage(1);
  }

  //　pager.component からの通知を受け取る
  onReceiveEventFromChild(eventData: number) {
    this.dataset.splice(0);
    const load_name = this.data.getLoadNameColumns(eventData);
    this.load_name = load_name.name;
    this.checkLL(load_name.symbol);

    this.page = eventData;
    this.loadPage(eventData, this.ROWS_COUNT);
    this.grid.refreshDataAndView();
    this.three.ChangePage(eventData);
  }

  //
  loadPage(currentPage: number, row: number) {
    for (let i = this.dataset.length + 1; i <= row; i++) {
      const load = this.data.getLoadColumns(currentPage, i);
      this.dataset.push(load);
    }

    const load_name = this.data.getLoadNameColumns(currentPage);
    this.checkLL(load_name.symbol);
    if(this.LL_flg){
      this.LL_pitch = load_name.LL_pitch;
    }
    this.page = currentPage;
  }

  // 表の高さを計算する
  private tableHeight(): string {
    const containerHeight = this.app.getDialogHeight() - 70; // pagerの分減じる
    return containerHeight.toString();
  }
  // 表高さに合わせた行数を計算する
  private rowsCount(): number {
    const containerHeight = this.app.getDialogHeight();
    return Math.round(containerHeight / 30);
  }

  // グリッドの設定
  options1: pq.gridT.options = {
    showTop: false,
    reactive: true,
    sortable: false,
    locale: "jp",
    height: this.tableHeight(),
    numberCell: {
      show: false, // 行番号
    },
    colModel:
      this.helper.dimension === 3 ? this.columnHeaders3D : this.columnHeaders2D,
    dataModel: {
      data: this.dataset,
    },
    beforeTableView: (evt, ui) => {
      const finalV = ui.finalV;
      const dataV = this.dataset.length;
      if (ui.initV == null) {
        return;
      }
      if (finalV >= dataV - 1) {
        this.loadPage(this.page, dataV + this.ROWS_COUNT);
        this.grid.refreshDataAndView();
      }
    },
    selectEnd: (evt, ui) => {
      const range = ui.selection.iCells.ranges;
      const row = range[0].r1 + 1;
      const column = range[0].c1;
      this.three.selectChange("load_values", row, column);
    },
    change: (evt, ui) => {
      for (const range of ui.updateList) {
        // L1行に 数字ではない入力がされていたら削除する
        const L1 = this.helper.toNumber(range.rowData["L1"]);
        if (L1 === null) {
          range.rowData["L1"] = null;
        }
        const direction = range.rowData["direction"];
        if (direction !== undefined && direction !== null) {
          range.rowData["direction"] = direction.trim().toLowerCase();
        }
        const row = range.rowIndx + 1;
        this.three.changeData("load_values", row);
      }
    },
  };
  width1 = this.helper.dimension === 3 ? 1020 : 810;

  // グリッドの設定
  options2: pq.gridT.options = {
    showTop: false,
    reactive: true,
    sortable: false,
    locale: "jp",
    height: this.tableHeight(),
    numberCell: {
      show: false, // 行番号
    },
    colModel:
      this.helper.dimension === 3
        ? this.columnHeaders3D_LL
        : this.columnHeaders2D_LL,
    dataModel: {
      data: this.dataset,
    },
    beforeTableView: (evt, ui) => {
      const finalV = ui.finalV;
      const dataV = this.dataset.length;
      if (ui.initV == null) {
        return;
      }
      if (finalV >= dataV - 1) {
        this.loadPage(this.page, dataV + this.ROWS_COUNT);
        this.grid.refreshDataAndView();
      }
    },
    selectEnd: (evt, ui) => {
      const range = ui.selection.iCells.ranges;
      const row = range[0].r1 + 1;
      const column = range[0].c1;
      this.three.selectChange("load_values", row, column);
    },
    change: (evt, ui) => {
      for (const range of ui.updateList) {
        // L1行に 数字ではない入力がされていたら削除する
        const L1 = this.helper.toNumber(range.rowData["L1"]);
        if (L1 === null) {
          range.rowData["L1"] = null;
        }
        const direction = range.rowData["direction"];
        if (direction !== undefined && direction !== null) {
          range.rowData["direction"] = direction.trim().toLowerCase();
        }
        const row = range.rowIndx + 1;
        this.three.changeData("load_values", row);
      }
    },
  };
  width2 = this.helper.dimension === 3 ? 550 : 445;

  // 連行荷重のピッチを変えた場合
  public change_pich() {

    if(this.LL_pitch < 0.1){
      this.LL_pitch = 0.1;
      return;
    }
    // 入力情報をデータに反映する
    const load_name = this.data.getLoadNameColumns(this.page);
    load_name.LL_pitch = this.LL_pitch;

    this.threeLoad.change_LL_Load(this.page.toString()); 
  }

  private checkLL(symbol: string): void{
    if (symbol === undefined) {
      this.LL_flg = false;
      return
    }
    if (symbol.includes("LL")) {
      this.LL_flg = true;
    } else {
      this.LL_flg = false;
    }
  }
}