import { Component, OnInit } from "@angular/core";
import { InputDataService } from "../../../../providers/input-data.service";
import { ResultDataService } from "../../../../providers/result-data.service";
import { AfterViewInit } from "@angular/core";
import { JsonpClientBackend } from "@angular/common/http";
import { DataCountService } from "../dataCount.service";
import { DataHelperModule } from "src/app/providers/data-helper.module";

@Component({
  selector: "app-print-result-reac",
  templateUrl: "./print-result-reac.component.html",
  styleUrls: [
    "../../../../app.component.scss",
    "../invoice.component.scss",
    "../invoice.component.scss",
  ],
})
export class PrintResultReacComponent implements OnInit, AfterViewInit {
  isEnable = true;
  page: number;
  load_name: string;
  btnPickup: string;
  tableHeight: number;
  invoiceIds: string[];
  invoiceDetails: Promise<any>[];
  reROW: number = 0;
  remainCount: number = 0;
  dimension: number;

  public reac_table = [];
  public reac_break = [];
  public reac_typeNum = [];

  public judge: boolean;

  constructor(
    private InputData: InputDataService,
    private ResultData: ResultDataService,
    private countArea: DataCountService,
    private helper: DataHelperModule ) {
    this.dimension = this.helper.dimension;
    this.clear();
  }

  public clear(): void {
    this.reac_table = new Array();
    this.reac_break = new Array();
    this.reac_typeNum = new Array();
  }

  ngOnInit(): void {
    // const json: {} = this.ResultData.reac.getDisgJson();
    const resultjson: any = this.ResultData.reac.getReacJson();
    const tables = this.printReact(resultjson);
    this.reac_table = tables.table;
    this.reac_break = tables.break_after;
    this.reac_typeNum = tables.title;
    this.judge = this.countArea.setCurrentY(tables.this, tables.last);
  }

  ngAfterViewInit() {}

  private printReact(json): any {
    const keys: string[] = Object.keys(json);

    // γγΌγγ«
    const splid: any[] = new Array();
    const titleSum: string[] = new Array();
    let row: number = 0;
    for (const index of keys) {
      if (index === "1") {
        row = 7;
      } else {
        row = 4;
      }
      const elist = json[index]; // 1γγΌγγ«εγ?γγΌγΏγεγεΊγ
      const table: any[] = new Array(); // γγ?ζηΉγ§γͺγ»γγγεε?ηΎ© δΈζ¦η©Ίγ«γγ

      // θ·ιεη§°
      const title: any = [];
      let loadName: string = "";
      const l: any = this.InputData.load.getLoadNameJson(null, index);
      if (index in l) {
        loadName = l[index].name;
        title.push(["Case" + index, loadName]);
      }
      titleSum.push(title);

      let body: any[] = new Array();

      for (const key of Object.keys(elist)) {
        const item = elist[key];

        const line = ["", "", "", "", "", "", "", ""];
        line[0] = item.id.toString();
        line[1] = (Math.round(item.tx *100 )/100).toFixed(2);
        line[2] = (Math.round(item.ty *100 )/100).toFixed(2);
        line[3] = (Math.round(item.tz *100 )/100).toFixed(2);
        line[4] = (Math.round(item.mx *100 )/100).toFixed(2);
        line[5] = (Math.round(item.my *100 )/100).toFixed(2);
        line[6] = (Math.round(item.mz *100 )/100).toFixed(2);
        body.push(line);
        row++;

        //οΌγγΌγγ«γ§59θ‘δ»₯δΈγγΌγΏγγγγͺγγ°
        if (row > 54) {
          table.push(body);
          body = [];
          row = 2;
        }
      }

      if (body.length > 0) {
        table.push(body);
      }
      splid.push(table);
    }

    // ε¨δ½γ?ι«γγθ¨η?γγ
    let countCell = 0;
    for (const index of keys) {
      const elist = json[index]; // 1γγΌγγ«εγ?γγΌγΏγεγεΊγ
      countCell += Object.keys(elist).length;
    }
    const countHead = keys.length * 2;
    const countSemiHead = splid.length * 2;
    const countTotal = countCell + countHead + countSemiHead + 3;

    //γεγΏγ€γγ?εγ«ζΉγγΌγΈ(break_after)γεΏθ¦γγ©γγγε€ε?γγγ
    const break_after: boolean[] = new Array();
    let ROW = 7;
    for (const index of keys) {
      this.reROW = 0;
      const elist = json[index]; // 1γγΌγγ«εγ?γγΌγΏγεγεΊγ
      let countCell = Object.keys(elist).length;
      ROW += countCell;

      if (ROW < 54) {
        break_after.push(false);
        this.reROW = ROW + 4;
        ROW = ROW + 4;
      } else {
        if (index === "1") {
          break_after.push(false);
        } else {
          break_after.push(true);
          ROW = 0;
        }
        let countHead_break = Math.floor((countCell / 54) * 2 + 2);
        this.reROW = ROW % 55;
        ROW += countHead_break + countCell;
        ROW = ROW % 54;
        ROW += 4;
      }
    }

    this.remainCount = this.reROW;

    //ζεΎγ?γγΌγΈγ«γ©γγ γγγΌγΏγζ?γ£γ¦γγγγζ±γγ
    let lastArrayCount: number = this.remainCount;

    return {
      table: splid, // [γΏγ€γοΌγ?γγΌγγ«γͺγΉγ[], γΏγ€γοΌγ?γγΌγγ«γͺγΉγ[], ...]
      title: titleSum, // [γΏγ€γοΌγ?γΏγ€γγ«, γΏγ€γοΌγ?γΏγ€γγ«, ... ]
      this: countTotal, // ε¨δ½γ?ι«γ
      last: lastArrayCount, // ζεΎγ?γγΌγΈγ?ι«γ
      break_after: break_after, // εγΏγ€γγ?εγ«ζΉγγΌγΈοΌbreak_afterοΌγεΏθ¦γγ©γγε€ε?
    };
  }
}
