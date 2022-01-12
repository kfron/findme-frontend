import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { ModalDialogOptions, ModalDialogService, registerElement, RouterExtensions } from '@nativescript/angular';
import { AndroidApplication } from '@nativescript/core';
import { ImagePicker } from '@nativescript/imagepicker';
import { RadDataFormComponent } from 'nativescript-ui-dataform/angular';
import { AuthService } from './../../../auth/auth.service';
import { MapModelRootComponent } from './../../components/map-model-root/map-model-root.component';
import { HomeService } from './../../home.service';
import * as metadata from './adMetadata.json';
import { ImageButtonEditorHelper, PositionButtonEditorHelper } from './buttonEditorHelpers';
import { AgeValidator, EmptyValidator } from './validators';



registerElement('EmptyValidator', () => EmptyValidator);
registerElement('AgeValidator', () => AgeValidator);

@Component({
	moduleId: module.id,
	selector: 'fm-missing-pet-ad-create',
	templateUrl: './missing-pet-ad-create.component.html',
	styleUrls: ['./missing-pet-ad-create.component.scss']
})
export class MissingPetAdCreateComponent implements OnInit {
	adMetadata = JSON.parse(JSON.stringify(metadata));
	private imageButtonEditorHelper: ImageButtonEditorHelper;
	private positionButtonEditorHelper: PositionButtonEditorHelper;
	user = this.authService.currentUser;
	ad;
	url = '';

	context: ImagePicker = new ImagePicker({ mode: 'single' })

	options: ModalDialogOptions = {
		viewContainerRef: this.vcRef,
		context: {},
		fullscreen: true
	};

	constructor(
		private authService: AuthService,
		private homeService: HomeService,
		private routerExtensions: RouterExtensions,
		private modalService: ModalDialogService,
		private vcRef: ViewContainerRef) { }

	@ViewChild('adCreateDataForm', { static: false }) adCreateDataForm: RadDataFormComponent;

	ngOnInit() {
		this.ad = { name: '', age: null, description: '', image: '', lastKnownPosition: '0 0' };
	}

	async validateAndCommit() {
		const isValid = await this.adCreateDataForm.dataForm.validateAndCommitAll();
		if (isValid) {
			this.homeService.createAd(
				this.ad.name,
				this.ad.age,
				this.ad.image,
				this.ad.description,
				this.ad.lastKnownPosition);
		}
	}

	positionEditorNeedsView(args) {
		if (AndroidApplication) {
			this.positionButtonEditorHelper = new PositionButtonEditorHelper();
			this.positionButtonEditorHelper.editor = args.object;
			const androidEditorView: android.widget.Button = new android.widget.Button(args.context);
			const that = this;
			androidEditorView.setOnClickListener(new android.view.View.OnClickListener({
				onClick(view: android.view.View) {
					that.positionHandleTap(view, args.object);
				}
			}));
			args.view = androidEditorView;
			this.positionUpdateEditorValue(androidEditorView, this.ad.lastKnownPosition);
		}
	}

	positionEditorHasToApplyValue(args) {
		this.positionButtonEditorHelper.updateEditorValue(args.view, args.value);
	}

	positionEditorNeedsValue(args) {
		args.value = this.positionButtonEditorHelper.buttonValue;
	}

	positionUpdateEditorValue(editorView, value) {
		this.positionButtonEditorHelper.buttonValue = value;
		if (value === '0 0')
			editorView.setText('(tap to choose)');
		else
			editorView.setText(value);
	}

	async positionHandleTap(editorView, editor) {
		const result = await this.modalService.showModal(MapModelRootComponent, this.options);
		if (result) {
			this.ad.lastKnownPosition = result.latitude + ' ' + result.longitude;
			this.positionUpdateEditorValue(editorView, this.ad.lastKnownPosition);
			editor.notifyValueChanged();
		}
	}

	imageEditorNeedsView(args) {
		if (AndroidApplication) {
			this.imageButtonEditorHelper = new ImageButtonEditorHelper();
			this.imageButtonEditorHelper.editor = args.object;
			const androidEditorView: android.widget.Button = new android.widget.Button(args.context);
			const that = this;
			androidEditorView.setOnClickListener(new android.view.View.OnClickListener({
				onClick(view: android.view.View) {
					that.imageHandleTap(view, args.object);
				}
			}));
			args.view = androidEditorView;
			this.imageUpdateEditorValue(androidEditorView, this.ad.image);
		}
	}

	imageEditorHasToApplyValue(args) {
		this.imageButtonEditorHelper.updateEditorValue(args.view, args.value);
	}

	imageEditorNeedsValue(args) {
		args.value = this.imageButtonEditorHelper.buttonValue;
	}

	imageUpdateEditorValue(editorView, value) {
		this.imageButtonEditorHelper.buttonValue = value;
		const splitUrl = this.url.split('/');
		const imageName = splitUrl[splitUrl.length - 1];
		if (value === '')
			editorView.setText('(tap to choose)');
		else
			editorView.setText(imageName + '\n (tap to change)');
	}

	imageHandleTap(editorView, editor) {
		this.context
			.authorize()
			.then(() => {
				return this.context.present();
			})
			.then(selection => {
				selection.forEach(selected => {
					this.url = selected.android;
					this.imageUpdateEditorValue(editorView, this.url);
					editor.notifyValueChanged();
				});
			})
			.catch(err => {
				console.log(err);
			});
	}

	onBackButtonTap() {
		this.routerExtensions.backToPreviousPage();
	}
}