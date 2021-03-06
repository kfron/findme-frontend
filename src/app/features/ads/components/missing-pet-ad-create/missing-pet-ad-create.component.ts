import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { ModalDialogOptions, ModalDialogService, registerElement, RouterExtensions } from '@nativescript/angular';
import { AndroidApplication } from '@nativescript/core';
import { ImagePicker } from '@nativescript/imagepicker';
import { RadDataFormComponent } from 'nativescript-ui-dataform/angular';
import { UserService } from '~/app/shared/services/user.service';
import { AdsService } from '../../ads.service';
import { MapModalRootComponent } from '../map-modal-root/map-modal-root.component';
import * as metadata from './adMetadata.json';
import { ImageButtonEditorHelper, PositionButtonEditorHelper } from './buttonEditorHelpers';
import { AgeValidator, ImageValidator, PositionValidator } from './validators';

registerElement('ImageValidator', () => ImageValidator);
registerElement('PositionValidator', () => PositionValidator);
registerElement('AgeValidator', () => AgeValidator);

@Component({
	moduleId: module.id,
	selector: 'fm-missing-pet-ad-create',
	templateUrl: './missing-pet-ad-create.component.html',
	styleUrls: ['./missing-pet-ad-create.component.scss']
})
export class MissingPetAdCreateComponent implements OnInit {
	private imageButtonEditorHelper: ImageButtonEditorHelper;
	private positionButtonEditorHelper: PositionButtonEditorHelper;


	// dane konfiguracyjne formularza
	adMetadata = JSON.parse(JSON.stringify(metadata));

	user = this.userService.currentUser;
	ad;
	url = '';

	context: ImagePicker = new ImagePicker({ mode: 'single' })

	options: ModalDialogOptions = {
		viewContainerRef: this.vcRef,
		context: {},
		fullscreen: true
	};

	constructor(
		private userService: UserService,
		private adsService: AdsService,
		private routerExtensions: RouterExtensions,
		private modalService: ModalDialogService,
		private vcRef: ViewContainerRef) { }

	/**
	 * Pobranie odniesienia do formularza stworzonego w pliku HTML.
	 */
	@ViewChild('adCreateDataForm', { static: false }) adCreateDataForm: RadDataFormComponent;

	/**
	 * Inicjalizacja danych do formularza
	 */
	ngOnInit() {
		this.ad = { name: '', age: null, description: '', image: '', lastKnownPosition: '0 0' };
	}

	/**
	 * Waliduje i aktualizuje pola formularza.
	 * Je??li pola s?? poprawne, to wysy??a ????danie stworzenia zg??oszenia.
	 */	
	async validateAndCommit() {
		const isValid = await this.adCreateDataForm.dataForm.validateAndCommitAll();
		if (isValid) {
			this.adsService.createAd(
				this.ad.name,
				this.ad.age,
				this.ad.image,
				this.ad.description,
				this.ad.lastKnownPosition);
		}
	}

	/**
	 * Pomocnicza funkcja wykorzystywana przez niestandardowy edytor pola formularza - edytor pozycji.
	 * Pobiera element widoku przedstawiaj??cy edytor, nadaje mu now?? obs??ug?? zdarzenia klikni??cia
	 * oraz spos??b aktualizacji warto??ci edytora.
	 * 
	 * @param args - obiekt zawieraj??cy odniesienie do edytora
	 */
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

	/**
	 * Pomocnicza funkcja wykorzystywana przez niestandardowy edytor pola formularza - edytor pozycji.
	 * Wywo??uje funkcj?? aktulizacji warto??ci edytora na pomocniczym obiekcie.
	 * 
	 * @param args - obiekt zawieraj??cy odniesienie do przycisku edytora oraz now?? warto????. 
	 */
	positionEditorHasToApplyValue(args) {
		this.positionButtonEditorHelper.updateEditorValue(args.view, args.value);
	}

	/**
	 * Pomocnicza funkcja wykorzystywana przez niestandardowy edytor pola formularza - edytor pozycji.
	 * ????czy warto???? wy??wietlan?? w edytorze z warto??ci?? pomocniczego obiektu.
	 * 
	 * @param args - obiekt zawieraj??cy warto???? edytora
	 */
	positionEditorNeedsValue(args) {
		args.value = this.positionButtonEditorHelper.buttonValue;
	}

	/**
	 * Obs??uguje aktualizacj?? warto??ci edytora.
	 * Ustawia wy??wietlan?? warto???? edytora i obiektu pomocnicznego na napis z??o??ony z koordynat??w wybranej pozycji.
	 * 
	 * @param editorView - obiekt przedstawiaj??cy widok edytora
	 * @param value - nowa warto???? edytora
	 */
	positionUpdateEditorValue(editorView, value) {
		this.positionButtonEditorHelper.buttonValue = value;
		if (value === '0 0')
			editorView.setText('(tap to choose)');
		else
			editorView.setText(value);
	}

	/**
	 * Obs??uguj?? zdarzenie naci??ni??cia przycisku edytora przez u??ytkownika.
	 * Wywo??uje okno modalne w kt??rym u??ytkownik wybiera pozycje na mapie.
	 * Je??li okno zwr??ci warto????, funkcja j?? przetworzy i wywo??a aktualizacj?? warto??ci edytora.
	 * 
	 * @param editorView - obiekt przedstawiaj??cy widok edytora
	 * @param editor - obiekt przedstawiaj??cy edytor
	 */
	async positionHandleTap(editorView, editor) {
		const result = await this.modalService.showModal(MapModalRootComponent, this.options);
		if (result) {
			this.ad.lastKnownPosition = result.latitude + ' ' + result.longitude;
			this.positionUpdateEditorValue(editorView, this.ad.lastKnownPosition);
			editor.notifyValueChanged();
		}
	}

	/**
	 * Pomocnicza funkcja wykorzystywana przez niestandardowy edytor pola formularza - edytor zdj??cia.
	 * Pobiera element widoku przedstawiaj??cy edytor, nadaje mu now?? obs??ug?? zdarzenia klikni??cia
	 * oraz spos??b aktualizacji warto??ci edytora.
	 * 
	 * @param args - obiekt zawieraj??cy odniesienie do edytora
	 */
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

	/**
	 * Pomocnicza funkcja wykorzystywana przez niestandardowy edytor pola formularza - edytor zdj??cia.
	 * Wywo??uje funkcj?? aktulizacji warto??ci edytora na pomocniczym obiekcie.
	 * 
	 * @param args - obiekt zawieraj??cy odniesienie do przycisku edytora oraz now?? warto????. 
	 */
	imageEditorHasToApplyValue(args) {
		this.imageButtonEditorHelper.updateEditorValue(args.view, args.value);
	}

	/**
	 * Pomocnicza funkcja wykorzystywana przez niestandardowy edytor pola formularza - edytor zdj??cia.
	 * ????czy warto???? wy??wietlan?? w edytorze z warto??ci?? pomocniczego obiektu.
	 * 
	 * @param args - obiekt zawieraj??cy warto???? edytora
	 */
	imageEditorNeedsValue(args) {
		args.value = this.imageButtonEditorHelper.buttonValue;
	}

	/**
	 * Obs??uguje aktualizacj?? warto??ci edytora.
	 * Obiektowi pomocniczemu edytora przypisuje pe??n?? warto???? - ??cie??ka wraz z nazw?? pliku.
	 * Ustawia wy??wietlan?? warto???? edytora na nazw?? pliku + podpowied?? dla u??ytkownika.
	 * 
	 * @param editorView - obiekt przedstawiaj??cy widok edytora
	 * @param value - nowa warto???? edytora
	 */
	imageUpdateEditorValue(editorView, value) {
		this.imageButtonEditorHelper.buttonValue = value;
		const splitUrl = this.url.split('/');
		const imageName = splitUrl[splitUrl.length - 1];
		if (value === '')
			editorView.setText('(tap to choose)');
		else
			editorView.setText(imageName + '\n (tap to change)');
	}

	/**
	 * Obs??uguj?? zdarzenie naci??ni??cia przycisku edytora przez u??ytkownika.
	 * Korzysta z biblioteki ImagePicker, aby wy??wietli?? dost??pne na urz??dzeniu zdj??cia i umo??liwi??
	 * wyb??r jednego z nich. Wybrane zdj??cie pos??u??y do stworzenia zg??oszenia.
	 * 
	 * @param editorView - obiekt przedstawiaj??cy widok edytora
	 * @param editor - obiekt przedstawiaj??cy edytor
	 */
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

	/**
	 * Obs??uga przycisku powrotu - nawiguje do poprzedniej strony.
	 */
	onBackButtonTap() {
		this.routerExtensions.backToPreviousPage();
	}
}