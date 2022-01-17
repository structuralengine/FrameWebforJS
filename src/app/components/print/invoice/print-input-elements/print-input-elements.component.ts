import { Component, OnInit } from "@angular/core";
import { InputDataService } from "../../../../providers/input-data.service";
import { AfterViewInit } from "@angular/core";
import { DataCountService } from "../dataCount.service";
import { ArrayCamera } from "three";
import { PrintService } from "../../print.service";
import { DataHelperModule } from "src/app/providers/data-helper.module";

@Component({
  selector: "app-print-input-elements",
  templateUrl: "./print-input-elements.component.html",
  styleUrls: [
    "./print-input-elements.component.scss",
    "../../../../app.component.scss",
    "../invoice.component.scss",
  ],
})
export class PrintInputElementsComponent implements OnInit, AfterViewInit {
  isEnable = true;
  page: number;
  load_name: string;
  countCell: number = 0;
  countHead: number = 0;
  countTotal: number = 0;
  btnPickup: string;
  tableHeight: number;
  invoiceIds: string[];
  invoiceDetails: Promise<any>[];
  reROW: number = 0;
  remainCount: number = 0;

  public elements_table = [];
  public elements_break = [];
  public elements_typeNum = [];

  public judge: boolean;
  public dimension: number;

  private splen = 5;
  public break_after: number;

  constructor(
    private printService: PrintService,
    private countArea: DataCountService,
    private helper: DataHelperModule
  ) {
    this.judge = false;
    this.dimension = this.helper.dimension;
    this.clear();
  }

  public clear(): void {
    this.elements_table = new Array();
    this.elements_break = new Array();
    this.elements_typeNum = new Array();
  }

  ngOnInit(): void {
    const inputJson: any = this.printService.inputJson;

    if ("element" in inputJson) {
      const tables = this.printElement(inputJson);
      this.elements_table = tables.table;
      this.elements_break = tables.break_after;
      this.elements_typeNum = tables.title;
      this.judge = this.countArea.setCurrentY(tables.this, tables.last);
    } else {
      this.isEnable = false;
    }
  }

  ngAfterViewInit() {}

  // 材料データ element を印刷する
  private printElement(inputJson): any {
    const json: {} = inputJson["element"]; // inputJsonからelementだけを取り出す
    const keys: string[] = Object.keys(json);

    // テーブル
    const splid: any[] = new Array();
    const title: string[] = new Array();
    let row: number = 8;
    for (const index of keys) {
      const elist = json[index]; // 1テーブル分のデータを取り出す
      const table: any[] = new Array(); // この時点でリセット、再定義 一旦空にする

      title.push(index.toString());

      let body: any[] = new Array();
      for (const key of Object.keys(elist)) {
        const item = elist[key];
        let line1: any[] = new Array();
        let line2: any[] = new Array();

        // const line = ["", "", "", "", "", "", "", ""];
        line1[0] = key;
        line1[1] = item.n;
        line2[0] = "";
        line2[1] = item.A.toFixed(4);
        line2[2] = item.E.toExponential(2);
        line2[3] = item.G.toExponential(2);
        line2[4] = item.Xp.toExponential(2);
        line2[5] = item.Iy.toFixed(6);
        line2[6] = item.Iz.toFixed(6);
        line2[7] = item.J.toFixed(6);
        body.push(line1, line2);
        row++;
      }

      splid.push(body);
      body = [];
    }

    return {
      table: splid, // [タイプ１のテーブルリスト[], タイプ２のテーブルリスト[], ...]
      title: title, // [タイプ１のタイトル, タイプ２のタイトル, ... ]
    };
  }
}