import { Injectable } from '@angular/core';
import * as THREE from 'three';
import { ThreeComponent } from './three.component';
import { GUI } from './libs/dat.gui.module.js';
import { OrbitControls } from './libs/OrbitControls.js';
import { CSS2DRenderer, CSS2DObject } from './libs/CSS2DRenderer.js';
import { SafeHtml } from '@angular/platform-browser';
import { DataHelperModule } from '../../providers/data-helper.module';

@Injectable({
  providedIn: 'root'
})
export class SceneService {

  // シーン
  private scene: THREE.Scene;

  // レンダラー
  private renderer: THREE.WebGLRenderer;
  private labelRenderer: CSS2DRenderer;

  // カメラ
  private camera: THREE.PerspectiveCamera | THREE.OrthographicCamera;
  private aspectRatio: number;
  private Width: number;
  private Height: number;

  // helper
  private axisHelper: THREE.AxesHelper;
  private GridHelper: THREE.GridHelper;

  // gui
  public gui: GUI;
  private params: any;          // GridHelperの表示制御

  // 初期化
  public constructor(private helper: DataHelperModule) {
    // シーンを作成
    this.scene = new THREE.Scene();
    // シーンの背景を白に設定
    // this.scene.background = new THREE.Color(0xf0f0f0);
    this.scene.background = new THREE.Color( 0xffffff );
    // レンダラーをバインド
    this.render = this.render.bind(this);

    // gui
    this.params = {
      GridHelper: true,
    };
  }



  public OnInit(aspectRatio: number,
                canvasElement: HTMLCanvasElement,
                deviceRatio: number,
                Width: number,
                Height: number): void {
    // カメラ
    this.aspectRatio = aspectRatio;
    this.Width = Width;
    this.Height = Height;
    this.createCamera(aspectRatio, Width, Height);
    // 環境光源
    this.add(new THREE.AmbientLight(0xf0f0f0));
    // レンダラー
    this.createRender(canvasElement,
                      deviceRatio,
                      Width,
                      Height);
    // コントロール
    this.addControls();

    // 床面を生成する
    this.createHelper();

    //
    this.gui = new GUI();
    this.gui.domElement.id = 'gui_css';
    this.gui.add( this.params, 'GridHelper' ).onChange( ( value ) => {
      // guiによる設定
      this.axisHelper.visible = value;
      this.GridHelper.visible = value;
      this.render();
    });
    this.gui.open();
  }

  // 床面を生成する
  private createHelper() {
    this.axisHelper = new THREE.AxesHelper(200);
    this.scene.add(this.axisHelper);

    this.GridHelper = new THREE.GridHelper(200, 20);
    this.GridHelper.geometry.rotateX(Math.PI / 2);
    this.GridHelper.material['opacity'] = 0.2;
    this.GridHelper.material['transparent'] = true;
    this.scene.add(this.GridHelper);

  }

  // コントロール
  public addControls() {
    const controls = new OrbitControls(this.camera, this.labelRenderer.domElement);
    controls.damping = 0.2;
    controls.addEventListener('change', this.render);
    controls.enableRotate = (this.helper.dimension === 3) ? true : false; // 2次元モードの場合はカメラの回転を無効にする
  }

   // 物体とマウスの交差判定に用いるレイキャスト
  public getRaycaster(mouse: THREE.Vector2): THREE.Raycaster {
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, this.camera);
    return raycaster;
  }

  // カメラの初期化
  public createCamera(
    aspectRatio: number=null,
    Width: number=null, Height: number=null ) {

    aspectRatio = (aspectRatio === null) ? this.aspectRatio : aspectRatio;
    Width = (Width === null) ? this.Width : Width;
    Height = (Height === null) ? this.Height : Height;

    const target = this.scene.getObjectByName('camera');
    if (target !== undefined) {
      this.scene.remove(this.camera);
    }
    if(this.helper.dimension === 3){
      this.camera = new THREE.PerspectiveCamera(
        70,
        aspectRatio,
        0.1,
        1000
      );
      this.camera.position.set(0, -50, 20);
      this.camera.name = 'camera';
      this.scene.add(this.camera);

    } else if(this.helper.dimension === 2){
      this.camera = new THREE.OrthographicCamera(
        -Width/10, Width/10,
        Height/10, -Height/10,
        0.1,
        21
      );
      this.camera.position.set(0, 0, 10);
      this.camera.name = 'camera';
      this.scene.add(this.camera);
    }
  }

  // レンダラーを初期化する
  public createRender(canvasElement: HTMLCanvasElement,
                      deviceRatio: number,
                      Width: number,
                      Height: number): void {
    this.renderer = new THREE.WebGLRenderer({
      preserveDrawingBuffer: true,
      canvas: canvasElement,
      alpha: true,    // transparent background
      antialias: true // smooth edges
    });
    this.renderer.setPixelRatio(deviceRatio);
    this.renderer.setSize(Width, Height);
    this.renderer.shadowMap.enabled = true;
    // this.renderer.setClearColorHex( 0x000000, 1 );

    this.labelRenderer = new CSS2DRenderer();
    this.labelRenderer.setSize(Width, Height);
    this.labelRenderer.domElement.style.position = 'absolute';
  }

  public labelRendererDomElement(): Node {
    return this.labelRenderer.domElement;
  }

  // リサイズ
  public onResize(deviceRatio: number,
                  Width: number,
                  Height: number): void {

    if('aspect' in this.camera) { this.camera['aspect'] = deviceRatio; }
    if('left' in this.camera) { this.camera['left'] = -Width/2; }
    if('right' in this.camera) { this.camera['right'] = Width/2; }
    if('top' in this.camera) { this.camera['top'] = Height/2; }
    if('bottom' in this.camera) { this.camera['bottom'] = -Height/2; }

    this.camera.updateProjectionMatrix();
    this.renderer.setSize(Width, Height);
    this.labelRenderer.setSize(Width, Height);
    this.render();
  }

  // レンダリングする
  public render() {
    this.renderer.render(this.scene, this.camera);
    this.labelRenderer.render(this.scene, this.camera);
  }

  // レンダリングのサイズを取得する
  public getBoundingClientRect(): ClientRect | DOMRect  {
    return this.renderer.domElement.getBoundingClientRect();
  }

  // シーンにオブジェクトを追加する
  public add(...threeObject: THREE.Object3D[]): void {
    for (const obj of threeObject) {
      this.scene.add(obj);
    }
  }

  // シーンのオブジェクトを削除する
  public remove(...threeObject: THREE.Object3D[]): void {
    for (const obj of threeObject) {
      this.scene.remove(obj);
    }
  }

  // シーンにオブジェクトを削除する
  public removeByName(...threeName: string[]): void {
    for (const name of threeName) {
      const target = this.scene.getObjectByName(name);
      if (target === undefined) {
        continue;
      }
      this.scene.remove(target);
    }
  }

  // ファイルに視点を保存する
  public getSettingJson(): any {
    return {
      camera: {
        x: this.camera.position.x,
        y: this.camera.position.y,
        z: this.camera.position.z,
      }
    };
  }

  // 視点を読み込む
  public setSetting( jsonData: {} ): void {
    if (!('three' in jsonData)) {
      return;
    }
    const setting: any = jsonData['three'];
    const x: number = this.helper.toNumber(setting.camera.x);
    if (x !== null ){
      const y: number = this.helper.toNumber(setting.camera.y);
      if (y !== null ){
        const z: number = this.helper.toNumber(setting.camera.z);
        if (z !== null ){
          this.camera.position.set(x, y, z);
    }}}


  }


}
