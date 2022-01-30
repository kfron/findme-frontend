import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RouterExtensions } from '@nativescript/angular';
import { AndroidApplication } from '@nativescript/core';
import { ImagePicker } from '@nativescript/imagepicker';
import { RadDataFormComponent } from 'nativescript-ui-dataform/angular';
import { Subscription } from 'rxjs';
import { Ad } from '~/app/shared/models/ads.model';
import { MapService } from '~/app/shared/services/map.service';
import { AdsService } from '../../ads.service';
import * as metadata from './adMetadata.json';
import { ButtonEditorHelper } from './buttonEditorHelper';


@Component({
	moduleId: module.id,
	selector: 'fm-missing-pet-ad-edit',
	templateUrl: './missing-pet-ad-edit.component.html',
	styleUrls: ['./missing-pet-ad-edit.component.scss']
})
export class MissingPetAdEditComponent implements OnInit, OnDestroy {
	private subscriptions: Subscription[] = []

	// dane konfiguracyjne formularza
	adMetadata = JSON.parse(JSON.stringify(metadata));
	buttonEditorHelper: ButtonEditorHelper;
	ad: Ad;
	id: number;
	url = '';
	isBusy = false;
	imageChanged = false;

	context: ImagePicker = new ImagePicker({ mode: 'single' })

	constructor(
		private routerExtensions: RouterExtensions,
		private adsService: AdsService,
		private mapService: MapService,
		private activatedRoute: ActivatedRoute) {
	}

	/**
	 * Pobranie odniesienia do formularza stworzonego w pliku HTML.
	 */
	@ViewChild('adEditDataForm', { static: false }) adEditDataForm: RadDataFormComponent;

	/**
	 * Pobranie danych z aktywnej ścieżki nawigacyjnej.
	 * Inizjalizacja zmiennych dotyczących edytowanego ogłoszenia.
	 */
	ngOnInit(): void {
		const aux = this.activatedRoute.snapshot.params as Ad;
		this.ad = { name: aux.name, age: aux.age, image: aux.image, description: aux.description } as Ad;
		this.id = aux.id;
		this.url = this.ad.image;
	}

	/**
	 * Przerwanie aktywnych subskrypcji w momencie zniszczenia komponentu.
	 */
	ngOnDestroy(): void {
		while (this.subscriptions.length != 0) {
			const sub = this.subscriptions.pop();
			sub.unsubscribe();
		}
	}

	/**
	 * Waliduje i aktualizuje pola formularza.
	 * Jeśli pola są poprawne i jeśli zdjęcie zostało zmienione to wysyła żądanie aktualizacji wraz ze zdjeciem.
	 * Jeśli są poprawne, a zdjęcie nie zostało zmienione to wysyła żądanie bez zdjecia.
	 * W przeciwnym wypadku nic się nie dzieje. 
	 */
	async validateAndCommit() {
		const isValid = await this.adEditDataForm.dataForm.validateAndCommitAll();
		if (isValid) {
			if (this.imageChanged) {
				this.adsService
					.updateAdWithImage(this.id, this.ad.name, this.ad.age, this.ad.image, this.ad.description);
			} else {
				this.subscriptions.push(
					this.adsService
						.updateAdWithoutImage(this.id, this.ad.name, this.ad.age, this.ad.description)
						.subscribe()
				);
				alert({
					title: 'Success!',
					okButtonText: 'OK',
					message: 'Ad updated.'
				});
			}
		}
	}

	/**
	 * Pomocnicza funkcja wykorzystywana przez niestandardowy edytor pola formularza - edytor zdjęcia.
	 * Pobiera element widoku przedstawiający edytor, nadaje mu nową obsługę zdarzenia kliknięcia
	 * oraz sposób aktualizacji wartości edytora.
	 * 
	 * @param args - obiekt zawierający odniesienie do edytora
	 */
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

	/**
	 * Pomocnicza funkcja wykorzystywana przez niestandardowy edytor pola formularza - edytor zdjęcia.
	 * Wywołuje funkcję aktulizacji wartości edytora na pomocniczym obiekcie.
	 * 
	 * @param args - obiekt zawierający odniesienie do przycisku edytora oraz nową wartość. 
	 */
	editorHasToApplyValue(args) {
		this.buttonEditorHelper.updateEditorValue(args.view, args.value);
	}

	/**
	 * Pomocnicza funkcja wykorzystywana przez niestandardowy edytor pola formularza - edytor zdjęcia.
	 * Łączy wartość wyświetlaną w edytorze z wartością pomocniczego obiektu.
	 * 
	 * @param args - obiekt zawierający wartość edytora
	 */
	editorNeedsValue(args) {
		args.value = this.buttonEditorHelper.buttonValue;
	}

	/**
	 * Obsługuje aktualizację wartości edytora.
	 * Obiektowi pomocniczemu edytora przypisuje pełną wartość - ścieżka wraz z nazwą pliku.
	 * Ustawia wyświetlaną wartość edytora na nazwę pliku + podpowiedź dla użytkownika.
	 * 
	 * @param editorView - obiekt przedstawiający widok edytora
	 * @param value - nowa wartość edytora
	 */
	updateEditorValue(editorView, value) {
		this.buttonEditorHelper.buttonValue = value;
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
	handleTap(editorView, editor) {

		this.context
			.authorize()
			.then(() => {
				this.imageChanged = true;
				return this.context.present();
			})
			.then(selection => {
				selection.forEach(selected => {
					this.url = selected.android;
					this.updateEditorValue(editorView, this.url);
					editor.notifyValueChanged();
				});
			})
			.catch(err => {
				console.log(err);
			});
	}

	/**
	 * Obsługa przycisku 'Delete' - wysyła żądanie usunięcia zgłoszenia.
	 * Wyświetla okno z informacją o sukcesie i nawiguje użytkownika do widoku głównego.
	 */
	onDeleteTap() {
		this.subscriptions.push(
			this.adsService.deleteAd(this.id).subscribe()
		);
		alert({
			title: 'Success!',
			okButtonText: 'OK',
			message: 'Ad deleted.'
		});
		this.mapService.navigateTo(['/home/']);
	}

	/**
	 * Obsługa przycisku powrotu - nawiguje do poprzedniej strony.
	 */
	onBackButtonTap() {
		this.routerExtensions.backToPreviousPage();
	}
}
