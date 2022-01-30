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
	 * Jeśli pola są poprawne, to wysyła żądanie stworzenia zgłoszenia.
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
	 * Pobiera element widoku przedstawiający edytor, nadaje mu nową obsługę zdarzenia kliknięcia
	 * oraz sposób aktualizacji wartości edytora.
	 * 
	 * @param args - obiekt zawierający odniesienie do edytora
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
	 * Wywołuje funkcję aktulizacji wartości edytora na pomocniczym obiekcie.
	 * 
	 * @param args - obiekt zawierający odniesienie do przycisku edytora oraz nową wartość. 
	 */
	positionEditorHasToApplyValue(args) {
		this.positionButtonEditorHelper.updateEditorValue(args.view, args.value);
	}

	/**
	 * Pomocnicza funkcja wykorzystywana przez niestandardowy edytor pola formularza - edytor pozycji.
	 * Łączy wartość wyświetlaną w edytorze z wartością pomocniczego obiektu.
	 * 
	 * @param args - obiekt zawierający wartość edytora
	 */
	positionEditorNeedsValue(args) {
		args.value = this.positionButtonEditorHelper.buttonValue;
	}

	/**
	 * Obsługuje aktualizację wartości edytora.
	 * Ustawia wyświetlaną wartość edytora i obiektu pomocnicznego na napis złożony z koordynatów wybranej pozycji.
	 * 
	 * @param editorView - obiekt przedstawiający widok edytora
	 * @param value - nowa wartość edytora
	 */
	positionUpdateEditorValue(editorView, value) {
		this.positionButtonEditorHelper.buttonValue = value;
		if (value === '0 0')
			editorView.setText('(tap to choose)');
		else
			editorView.setText(value);
	}

	/**
	 * Obsługuję zdarzenie naciśnięcia przycisku edytora przez użytkownika.
	 * Wywołuje okno modalne w którym użytkownik wybiera pozycje na mapie.
	 * Jeśli okno zwróci wartość, funkcja ją przetworzy i wywoła aktualizację wartości edytora.
	 * 
	 * @param editorView - obiekt przedstawiający widok edytora
	 * @param editor - obiekt przedstawiający edytor
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
	 * Pomocnicza funkcja wykorzystywana przez niestandardowy edytor pola formularza - edytor zdjęcia.
	 * Pobiera element widoku przedstawiający edytor, nadaje mu nową obsługę zdarzenia kliknięcia
	 * oraz sposób aktualizacji wartości edytora.
	 * 
	 * @param args - obiekt zawierający odniesienie do edytora
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
	 * Pomocnicza funkcja wykorzystywana przez niestandardowy edytor pola formularza - edytor zdjęcia.
	 * Wywołuje funkcję aktulizacji wartości edytora na pomocniczym obiekcie.
	 * 
	 * @param args - obiekt zawierający odniesienie do przycisku edytora oraz nową wartość. 
	 */
	imageEditorHasToApplyValue(args) {
		this.imageButtonEditorHelper.updateEditorValue(args.view, args.value);
	}

	/**
	 * Pomocnicza funkcja wykorzystywana przez niestandardowy edytor pola formularza - edytor zdjęcia.
	 * Łączy wartość wyświetlaną w edytorze z wartością pomocniczego obiektu.
	 * 
	 * @param args - obiekt zawierający wartość edytora
	 */
	imageEditorNeedsValue(args) {
		args.value = this.imageButtonEditorHelper.buttonValue;
	}

	/**
	 * Obsługuje aktualizację wartości edytora.
	 * Obiektowi pomocniczemu edytora przypisuje pełną wartość - ścieżka wraz z nazwą pliku.
	 * Ustawia wyświetlaną wartość edytora na nazwę pliku + podpowiedź dla użytkownika.
	 * 
	 * @param editorView - obiekt przedstawiający widok edytora
	 * @param value - nowa wartość edytora
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
	 * Obsługuję zdarzenie naciśnięcia przycisku edytora przez użytkownika.
	 * Korzysta z biblioteki ImagePicker, aby wyświetlić dostępne na urządzeniu zdjęcia i umożliwić
	 * wybór jednego z nich. Wybrane zdjęcie posłuży do stworzenia zgłoszenia.
	 * 
	 * @param editorView - obiekt przedstawiający widok edytora
	 * @param editor - obiekt przedstawiający edytor
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
	 * Obsługa przycisku powrotu - nawiguje do poprzedniej strony.
	 */
	onBackButtonTap() {
		this.routerExtensions.backToPreviousPage();
	}
}