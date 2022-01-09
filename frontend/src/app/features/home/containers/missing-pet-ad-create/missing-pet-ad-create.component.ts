import { LocationService } from './../../../../shared/services/location.service';
import { Position } from 'nativescript-google-maps-sdk';
import { Component, OnInit, ViewChild } from '@angular/core';
import { registerElement } from '@nativescript/angular';
import { AndroidApplication } from '@nativescript/core';
import { ImagePicker } from '@nativescript/imagepicker';
import { RadDataFormComponent } from 'nativescript-ui-dataform/angular';
import { AuthService } from './../../../auth/auth.service';
import { Ad } from './../../ads.model';
import { HomeService } from './../../home.service';
import { ButtonEditorHelper } from './buttonEditorHelper';
import { AgeValidator, EmptyValidator } from './validators';

const metadata = require('./adMetadata.json');

registerElement("EmptyValidator", () => <any>EmptyValidator);
registerElement("AgeValidator", () => <any>AgeValidator);

@Component({
  moduleId: module.id,
  selector: 'fm-missing-pet-ad-create',
  templateUrl: './missing-pet-ad-create.component.html',
  styleUrls: ['./missing-pet-ad-create.component.scss']
})
export class MissingPetAdCreateComponent implements OnInit {
  adMetadata = JSON.parse(JSON.stringify(metadata));
  buttonEditorHelper: ButtonEditorHelper;
  user = this.authService.currentUser;
  ad: Ad;
  url = '';
  pos: Position

  context: ImagePicker = new ImagePicker({ mode: "single" })

  constructor(
    private authService: AuthService, 
    private homeService: HomeService,
    private locationService: LocationService) { }

  @ViewChild('adCreateDataForm', { static: false }) adCreateDataForm: RadDataFormComponent;

  async ngOnInit() {
    this.ad = { name: '', age: null, image: '', description: '' } as Ad;
    this.pos = await this.locationService.getCurrentLocation();
  }

  async validateAndCommit() {
    let isValid = await this.adCreateDataForm.dataForm.validateAndCommitAll();
    if (isValid) {
      this.homeService.createAd(
        this.ad.name,
        this.ad.age,
        this.ad.image,
        this.ad.description,
        this.pos.latitude,
        this.pos.longitude);
    }
  }

  editorNeedsView(args) {
    if (AndroidApplication) {
      this.buttonEditorHelper = new ButtonEditorHelper();
      this.buttonEditorHelper.editor = args.object;
      const androidEditorView: android.widget.Button = new android.widget.Button(args.context);
      const that = this;
      androidEditorView.setOnClickListener(new android.view.View.OnClickListener({
        onClick(view: android.view.View) {
          that.handleTap(view, args.object);
        }
      }));
      args.view = androidEditorView;
      this.updateEditorValue(androidEditorView, this.ad.image);
    }
  }

  editorHasToApplyValue(args) {
    this.buttonEditorHelper.updateEditorValue(args.view, args.value);
  }

  editorNeedsValue(args) {
    args.value = this.buttonEditorHelper.buttonValue;
  }

  updateEditorValue(editorView, value) {
    this.buttonEditorHelper.buttonValue = value;
    let splitUrl = this.url.split('/');
    let imageName = splitUrl[splitUrl.length - 1];
    if (value === '')
      editorView.setText("(tap to choose)");
    else
      editorView.setText(imageName + "\n (tap to change)");
  }

  handleTap(editorView, editor) {

    this.context
      .authorize()
      .then(() => {
        return this.context.present();
      })
      .then(selection => {
        selection.forEach(selected => {
          this.url = selected.android;
          this.updateEditorValue(editorView, this.url);
          editor.notifyValueChanged();
        })
      })
      .catch(err => {
        console.log(err);
      })
  }
}