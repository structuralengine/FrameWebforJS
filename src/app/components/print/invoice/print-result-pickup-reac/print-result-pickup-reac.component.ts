import { Component, OnInit } from "@angular/core";
import { InputDataService } from "../../../../providers/input-data.service";
import { ResultDataService } from "../../../../providers/result-data.service";
import { AfterViewInit } from "@angular/core";
import { JsonpClientBackend } from "@angular/common/http";
import { DataCountService } from "../dataCount.service";
import { ResultCombineReacService } from "src/app/components/result/result-combine-reac/result-combine-reac.service";
import { DataHelperModule } from "src/app/providers/data-helper.module";

@Component({
  selector: "app-print-result-pickup-reac",
  templateUrl: "./print-result-pickup-reac.component.html",
  styleUrls: [
    "./print-result-pickup-reac.component.scss",
    "../../../../app.component.scss",
    "../invoice.component.scss",
  ],
})
export class PrintResultPickupReacComponent implements OnInit {
  isEnable = true;
  page: number;
  load_name: string;
  btnPickup: string;
  tableHeight: number;
  invoiceIds: string[];
  invoiceDetails: Promise<any>[];
  row: number = 0;
  dimension: number;

  public pickReac_datase = [];
  public pickReac_dataset = [];
  public pickReac_title = [];
  public pickReac_type = [];

  public pickReac_case_break = [];
  public pickReac_type_break = [];

  public judge: boolean;

  constructor(
    private InputData: InputDataService,
    private ResultData: ResultDataService,
    private countArea: DataCountService,
    private combReac: ResultCombineReacService,
    private helper: DataHelperModule ) {
      this.dimension = this.helper.dimension;
    this.judge = false;
  }

  ngOnInit(): void {
    const resultjson: any = this.ResultData.pickreac.reacPickup;
    const keys: string[] = Object.keys(resultjson);
    if (keys.length > 0) {
      const tables = this.printPickReact(resultjson);
      this.pickReac_dataset = tables.splid;
      this.pickReac_title = tables.titleSum;
      this.pickReac_case_break = tables.break_after_case;
      this.pickReac_type_break = tables.break_after_type;
      this.judge = this.countArea.setCurrentY(tables.this, tables.last);
    } else {
      this.isEnable = false;
    }
  }

  ngAfterViewInit() {}

  private printPickReact(json): any {
    const titleSum: any = [];
    const body: any[] = new Array();
    const typeSum: any = [];

    const KEYS = this.combReac.reacKeys;
    const TITLES = this.combReac.titles; 
    // [
    //   "tx_max",
    //   "tx_min",
    //   "ty_max",
    //   "ty_min",
    //   "tz_max",
    //   "tz_min",
    //   "mx_max",
    //   "mx_min",
    //   "my_max",
    //   "my_min",
    //   "mz_max",
    //   "mz_min",
    // ];
    // const TITLES = ['x????????????????????? ??????', 'x????????????????????? ??????', 'y????????????????????? ??????', 'y????????????????????? ??????', 'z????????????????????? ??????', 'Z????????????????????? ??????',
    //   'x???????????????????????? ??????', 'x???????????????????????? ??????', 'y???????????????????????? ??????', 'y???????????????????????? ??????', 'z???????????????????????? ??????', 'Z???????????????????????? ??????'];

    const keys: string[] = Object.keys(json);

    //???????????????
    const splid: any = [];
    let typeData: any = [];
    let typeDefinition: any = [];
    let typeName: any = [];
    let typeAll: any = [];
    this.row = 0;
    for (const index of keys) {
      const elist = json[index]; // 1??????????????????????????????????????????

      // ????????????
      const title: any = [];
      let loadName: string = "";
      const combineJson: any = this.InputData.combine.getCombineJson();
      if (index in combineJson) {
        if ("name" in combineJson[index]) {
          loadName = combineJson[index].name;
          title.push(["Case" + index, loadName]);
        } else {
          title.push(["Case" + index]);
        }
      }
      titleSum.push(title);

      let table: any = [];
      let type: any = [];
      for (let i = 0; i < KEYS.length; i++) {
        const key = KEYS[i];
        const title2 = TITLES[i];
        const elieli = json[index]; // 1?????????node????????????????????????
        if(!(key in elieli)) continue;

        typeName.push(title2);

        const elist = elieli[key]; // 1?????????node????????????????????????.
        let body: any = [];
        if (i === 0) {
          this.row = 9;
        } else {
          this.row = 6;
        }

        for (const k of Object.keys(elist)) {
          const item = elist[k];
          // ????????????1???????????????????????????
          const line = ["", "", "", "", "", "", "", ""];
          line[0] = k.toString();
          line[1] = item.tx.toFixed(2);
          line[2] = item.ty.toFixed(2);
          line[3] = item.tz.toFixed(2);
          line[4] = item.mx.toFixed(2);
          line[5] = item.my.toFixed(2);
          line[6] = item.mz.toFixed(2);
          line[7] = item.case;

          body.push(line);
          this.row++;

          //??????????????????54????????????????????????????????????
          if (this.row > 54) {
            table.push(body);
            body = [];
            this.row = 2;
          }
        }
        if (body.length > 0) {
          table.push(body);
        }

        if (table.length > 0) {
          typeData.push(table);
          table = [];
        }
        typeDefinition.push(typeName, typeData);
        typeAll.push(typeDefinition);
        typeName = [];
        typeData = [];
        typeDefinition = [];
      }

      splid.push(typeAll);
      typeAll = [];
    }

    let countHead: number = 0;
    let countSemiHead: number = 0;
    // ??????????????????????????????
    let countCell = 0;
    for (const index of keys) {
      const elist = json[index]; // 1??????????????????????????????????????????
      for (let i = 0; i < KEYS.length; i++) {
        const key = KEYS[i];
        const elieli = json[index]; // 1?????????node????????????????????????
        if(!(key in elieli)) continue;

        const elist = elieli[key]; // 1?????????node????????????????????????.
        for (const k of Object.keys(elist)) {
          countCell += Object.keys(elist).length;
        }
        countSemiHead += Object.keys(elieli).length * 3;
      }
      countHead += Object.keys(json).length;
    }

    const countTotal = countCell + countHead + countSemiHead + 3;

    //???????????????????????????????????????(break_after)???????????????????????????????????????
    const break_after_case: boolean[] = new Array();
    const break_after_type: boolean[] = new Array();
    let ROW_type = 4; // ???
    let ROW_case = 9;
    let countCell_type: number = 0;
    let countCell_case: number = 0;
    for (const index of Object.keys(json)) {
      const elieli = json[index]; // 1?????????node????????????????????????
      for (let i = 0; i < KEYS.length; i++) {
        const key: string = KEYS[i];
        if(!(key in elieli)) continue;

        const elist = elieli[key]; // 1?????????node????????????????????????.

        // x??????Max,min??????????????????????????????
        countCell_type = Object.keys(elist).length;

        ROW_type += countCell_type;
        ROW_case += countCell_type;

        if (ROW_type < 54) {
          break_after_type.push(false);
          ROW_type += 4;
        } else {
          if (i === 0) {
            break_after_type.push(false);
          } else {
            break_after_type.push(true);
            ROW_type = 0;
          }
          let countHead_break = Math.floor((countCell_type / 54) * 2 + 2);
          ROW_type += countCell_type + countHead_break;
          ROW_type = ROW_type % 54;
          ROW_type += 4;
        }
      }

      //????????????????????????????????????????????????
      countCell_case += Object.keys(elieli).length;
      ROW_case += countCell_case;
      if (ROW_case < 54) {
        break_after_case.push(false);
        ROW_case += 6;
      } else {
        if (index === "1") {
          break_after_case.push(false);
        } else {
          break_after_case.push(true);
        }
        let countHead_breakLoad = Math.floor((countCell_type / 54) * 2 + 5);
        ROW_case += countCell_type + countHead_breakLoad;
        ROW_case = ROW_type % 54;
        ROW_case += 6;
      }
    }
    //???????????????????????????????????????????????????
    let lastArrayCount: number = countTotal % 54;

    return {
      titleSum,
      splid,
      typeSum,
      break_after_case,
      break_after_type,
      this: countTotal,
      last: lastArrayCount, // ??????????????????????????? };
    };
  }
}
