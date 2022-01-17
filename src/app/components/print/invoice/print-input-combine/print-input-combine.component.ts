import { Component, OnInit } from "@angular/core";
import { AfterViewInit } from "@angular/core";
import { DataCountService } from "../dataCount.service";
import { PrintService } from "../../print.service";
import { InputCombineService } from "src/app/components/input/input-combine/input-combine.service";

@Component({
  selector: "app-print-input-combine",
  templateUrl: "./print-input-combine.component.html",
  styleUrls: [
    "./print-input-combine.component.scss",
    "../../../../app.component.scss",
    "../invoice.component.scss",
  ],
})
export class PrintInputCombineComponent implements OnInit, AfterViewInit {
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
  bottomCell: number = 50;

  public comb_tables = [];
  public comb_dataset = [];
  public comb_page = [];

  public judge: boolean;

  constructor(
    private printService: PrintService,
    private countArea: DataCountService,
    private combine: InputCombineService
  ) {
    this.judge = false;
    this.clear();
  }

  public clear(): void {
    this.comb_tables = new Array();
    this.comb_dataset = new Array();
    this.comb_page = new Array();
  }

  ngOnInit(): void {
    this.comb_tables = [];
    const combineJson: any = this.combine.getCombineJson();

    if (Object.keys(combineJson).length > 0) {
      const tables = this.printCombine(combineJson);
      this.comb_dataset = tables;
      // this.judge = this.countArea.setCurrentY(tables.this, tables.last);
    } else {
      this.isEnable = false;
    }
  }

  ngAfterViewInit() {}

  // COMBINEデータ  を印刷する
  private printCombine(json): any {
    let body: any[] = new Array();
    let page: number = 0;
    const splid: any[] = new Array();

    for (const index of Object.keys(json)) {
      const item = json[index]; // 1行分のnodeデータを取り出す

      // 印刷する1行分のリストを作る
      let line1: any[] = new Array();
      let line2: string[] = new Array();
      line1.push(index); // CombNo
      line2.push("").toFixed(2);
      if ("name" in item) {
        line1.push(item.name); // 荷重名称
      } else {
        line1.push("");
      }
      line2.push("").toFixed(2);

      if (index == "1") {
        console.log("2番目の処理が正常に完了");
        console.log("1", line1);
      }

      let counter: number = 0;
      for (const key of Object.keys(item)) {
        if (key === "row") {
          continue;
        }
        if (key === "name") {
          continue;
        }
        line1.push(key.replace("C", ""));
        line2.push(item[key].toFixed(2));
        counter += 1;
        if (counter === 8) {
          body.push(line1); // 表の1行 登録
          body.push(line2);
          counter = 0;
          line1 = new Array();
          line2 = new Array();
          line1.push(""); // CombNo
          line2.push("");
          line1.push(""); // 荷重名称
          line2.push("");
        }
      }
      if (counter > 0) {
        body.push(line1); // 表の1行 登録
        body.push(line2);
      }
    }
    if (body.length > 0) {
      splid.push(body);
    }

    return splid;
  }
}