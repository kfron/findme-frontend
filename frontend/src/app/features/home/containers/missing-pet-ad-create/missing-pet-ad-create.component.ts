import { ButtonEditorHelper } from './buttonEditorHelper';
import { Ad } from './../../ads.model';
import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from './../../../auth/auth.service';
import { RadDataFormComponent } from 'nativescript-ui-dataform/angular';
import { ImagePicker } from '@nativescript/imagepicker';
import { AndroidApplication } from '@nativescript/core';
import { PropertyValidator } from 'nativescript-ui-dataform';
import { registerElement } from '@nativescript/angular';

const metadata = require('./adMetadata.json');

registerElement("EmptyValidator", () => <any>EmptyValidator);

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

  context: ImagePicker = new ImagePicker({ mode: "single" })

  constructor(private authService: AuthService) { }

  @ViewChild('adCreateDataForm', { static: false }) adCreateDataForm: RadDataFormComponent;

  ngOnInit(): void {
    this.ad = { name: '', age: null, image: '', description: '' } as Ad;
  }

  async test() {
    console.log("Before validation and commit");
    console.log(this.ad);
    let isValid = await this.adCreateDataForm.dataForm.validateAndCommitAll();
    if (isValid) {
      console.log("Valid!");
      console.log(this.ad);
    } else {
      console.log("Not valid");
      console.log(this.ad);
    }
  }

  commitTest() {
    console.log("Commited!");
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
    if (value === '')
      editorView.setText("(tap to choose)");
    else 
      editorView.setText(this.buttonEditorHelper.buttonValue + "\n (tap to change)");
  }

  handleTap(editorView, editor) {

    this.context
      .authorize()
      .then(() => {
        return this.context.present();
      })
      .then(selection => {
        selection.forEach(selected => {
          console.log(selected);
          this.url = selected.android;
          console.log("url: " + this.url);
          let splitUrl = this.url.split('/');
          let imageName = splitUrl[splitUrl.length - 1];
          console.log(imageName);
          this.updateEditorValue(editorView, imageName);
          editor.notifyValueChanged();
        })
      })
      .catch(err => {
        console.log(err);
      })
  }
}



export class EmptyValidator extends PropertyValidator {
  constructor() {
    super();
    this.errorMessage = "Choose an image.";
  }

  public validate(value: any, propertyName: string): boolean {
    return value !== '';
  }
}