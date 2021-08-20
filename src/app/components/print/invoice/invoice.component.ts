import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { PrintService } from "../print.service";
import { DataCountService } from "./dataCount.service";

import { InputDataService } from "../../../providers/input-data.service";
import { ResultDataService } from "../../../providers/result-data.service";

import { InputCombineService } from "../../input/input-combine/input-combine.service";
import { InputDefineService } from "../../input/input-define/input-define.service";
import { InputNodesService } from "../../input/input-nodes/input-nodes.service";
import { InputElementsService } from "../../input/input-elements/input-elements.service";
import { InputMembersService } from "../../input/input-members/input-members.service";
import { InputFixMemberService } from "../../input/input-fix-member/input-fix-member.service";
import { AfterViewInit } from "@angular/core";
import { ThreeService } from "src/app/components/three/three.service";
import { SceneService } from "src/app/components/three/scene.service";
import { InputFixNodeService } from "../../input/input-fix-node/input-fix-node.service";
import { InputJointService } from "../../input/input-joint/input-joint.service";
import { InputLoadService } from "../../input/input-load/input-load.service";
import { InputNoticePointsService } from "../../input/input-notice-points/input-notice-points.service";
import { InputPickupService } from "../../input/input-pickup/input-pickup.service";
import { ResultCombineDisgService } from "../../result/result-combine-disg/result-combine-disg.service";
import { ResultCombineFsecService } from "../../result/result-combine-fsec/result-combine-fsec.service";
import { ResultCombineReacService } from "../../result/result-combine-reac/result-combine-reac.service";
import { ResultDisgService } from "../../result/result-disg/result-disg.service";
import { ResultFsecService } from "../../result/result-fsec/result-fsec.service";
import { ResultPickupDisgService } from "../../result/result-pickup-disg/result-pickup-disg.service";
import { ResultPickupFsecService } from "../../result/result-pickup-fsec/result-pickup-fsec.service";
import { ResultPickupReacService } from "../../result/result-pickup-reac/result-pickup-reac.service";
import { ResultReacService } from "../../result/result-reac/result-reac.service";
import { AppComponent } from "src/app/app.component";

import { PrintComponent } from "../print.component";

@Component({
  selector: "app-invoice",
  templateUrl: "./invoice.component.html",
  styleUrls: ["./invoice.component.scss", "../../../app.component.scss"],
})
export class InvoiceComponent implements OnInit, AfterViewInit {
  // page: number;
  // load_name: string;
  // btnPickup: string;
  // tableHeight: number;
  // invoiceIds: string[];
  // // invoiceDetails: Promise<any>[];
  // currentY : number = 0;

  // public node_dataset = [];
  // public comb_dataset = [];
  // public define_dataset = [];
  // public fixMember_dataset = [];
  // public fixMember_typeNum = [];
  // public fixNode_dataset = [];
  // public fixNode_typeNum = [];
  // public joint_dataset = [];
  // public joint_typeNum = [];
  // public loadName_dataset = [];
  // public load_title = [];
  // public load_member = [];
  // public load_node = [];
  // public member_dataset = [];
  // public notice_dataset = [];
  //  // public panel_dataset = [];
  // public pickup_dataset = [];
  // public elements_dataset = [];
  // public elements_typeNum = [];

  // public combDisg_dataset = [];
  // public combFesc_dataset = [];
  // public combReac_dataset = [];
  // public disg_dataset = [];
  // public disg_title = [];
  // public fesc_dataset = [];
  // public reac_dataset = [];

  // public myContentEditable: boolean[];

  // public dataExists:boolean[] = new Array();


  constructor(
    // route: ActivatedRoute,
    // public app: AppComponent,
    public printService: PrintService,
    // private InputData: InputDataService,
    // private ResultData: ResultDataService,
    // private comb: InputCombineService,
    // private nodes: InputNodesService,
    // private member: InputMembersService,
    // private define: InputDefineService,
    // private fixMember: InputFixMemberService,
    // private fixNode: InputFixNodeService,
    // private joint: InputJointService,
    // private load: InputLoadService,
    // private notice: InputNoticePointsService,
    // private panel: InputPanelService,
    // private pickup: InputPickupService,
    // private elements: InputElementsService,

    // private combDisg: ResultCombineDisgService,
    // private combFsec: ResultCombineFsecService,
    // private combReac: ResultCombineReacService,
    // private disg: ResultDisgService,
    // private fsec: ResultFsecService,
    // private reac: ResultReacService,
    // private pickDisg: ResultPickupDisgService,
    // private pickFsec: ResultPickupFsecService,
    // private pickReac: ResultPickupReacService,

    private countArea: DataCountService,

    // private three: ThreeService,
    // private scene: SceneService
  ) {
    // this.invoiceIds = route.snapshot.params["invoiceIds"].split(",");
  }

  ngOnInit() {
    this.countArea.clear();
    // this.myContentEditable = this.printService.contentEditable1;
  }

  ngAfterViewInit() {
    this.printService.onDataReady();
  }

}
