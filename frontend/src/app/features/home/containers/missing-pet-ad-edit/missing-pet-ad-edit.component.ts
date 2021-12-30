import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RouterExtensions } from '@nativescript/angular';
import { AndroidApplication } from '@nativescript/core';
import { ImagePicker } from '@nativescript/imagepicker';
import { RadDataFormComponent } from 'nativescript-ui-dataform/angular';
import { Subscription } from 'rxjs';
import { AuthService } from './../../../auth/auth.service';
import { Ad } from './../../ads.model';
import { HomeService } from './../../home.service';
import { ButtonEditorHelper } from './buttonEditorHelper';

const metadata = require('./adMetadata.json');

@Component({
  moduleId: module.id,
  selector: 'fm-missing-pet-ad-edit',
  templateUrl: './missing-pet-ad-edit.component.html',
  styleUrls: ['./missing-pet-ad-edit.component.scss']
})
export class MissingPetAdEditComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = []

  adMetadata = JSON.parse(JSON.stringify(metadata));
  buttonEditorHelper: ButtonEditorHelper;
  user = this.authService.currentUser;
  ad: Ad;
  id: Number;
  url = '';

  context: ImagePicker = new ImagePicker({ mode: "single" })

  constructor(
    private routerExtensions: RouterExtensions,
    private homeService: HomeService,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService) {
  }

  @ViewChild('adEditDataForm', { static: false }) adEditDataForm: RadDataFormComponent;

  ngOnInit(): void {
    let aux = this.activatedRoute.snapshot.params as Ad;
    this.ad = { name: aux.name, age: aux.age, image: aux.image, description: aux.description } as Ad;
    this.id = aux.id;
    this.url = this.ad.image;
  }

  ngOnDestroy(): void {
    while (this.subscriptions.length != 0) {
      var sub = this.subscriptions.pop();
      sub.unsubscribe();
    }
  }

  async validateAndCommit() {
    let isValid = await this.adEditDataForm.dataForm.validateAndCommitAll();
    if (isValid) {
      this.subscriptions.push(
        this.homeService
          .updateAd(this.id, this.ad.name, this.ad.age, this.ad.image, this.ad.description)
          .subscribe()
      );
      alert({
        title: "Success!",
        okButtonText: "OK",
        message: "Ad updated."
      });
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

  onDeleteTap() {
    this.subscriptions.push(
      this.homeService.deleteAd(this.id).subscribe()
    );
    alert({
      title: "Success!",
      okButtonText: "OK",
      message: "Ad deleted."
    });
  }

  onBackButtonTap() {
    this.routerExtensions.backToPreviousPage()
  }
}
