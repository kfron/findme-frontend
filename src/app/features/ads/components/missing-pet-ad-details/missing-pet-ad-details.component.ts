import { Component, OnDestroy, OnInit, ViewContainerRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalDialogOptions, ModalDialogService, RouterExtensions } from '@nativescript/angular';
import { NavigatedData, Page } from '@nativescript/core';
import { Subscription } from 'rxjs';
import { Ad } from '~/app/shared/models/ads.model';
import { UserService } from '~/app/shared/services/user.service';
import { MapService } from '../../../../shared/services/map.service';
import { AdsService } from '../../ads.service';
import { MapModalRootComponent } from '../map-modal-root/map-modal-root.component';

@Component({
	moduleId: module.id,
	selector: 'fm-missing-pet-ad-details',
	templateUrl: './missing-pet-ad-details.component.html',
	styleUrls: ['./missing-pet-ad-details.component.scss']
})
export class MissingPetAdDetailsComponent implements OnInit, OnDestroy {

	private subscriptions: Subscription[] = []
	owner = false;
	isBusy = false;

	options: ModalDialogOptions = {
		viewContainerRef: this.vcRef,
		context: {
			pinpointMode: false,
			adId: null
		},
		fullscreen: true
	};

	constructor(
		private userService: UserService,
		private activatedRoute: ActivatedRoute,
		private adsService: AdsService,
		private routerExtensions: RouterExtensions,
		private mapService: MapService,
		private page: Page,
		private modalService: ModalDialogService,
		private vcRef: ViewContainerRef) {
		this.page.on(Page.navigatedToEvent, (data: NavigatedData) => this.onNavigatedTo(data));
	}

	ad: Ad = undefined

	/**
	 * Pobranie id zgłoszenia z aktywnej ścieżki nawigacyjnej.
	 * Inizjalizacja kontekstu dla okna modalnego.
	 * Pobranie pełnych danych wyświetlanego zgłoszenia.
	 */
	ngOnInit(): void {
		const id = +this.activatedRoute.snapshot.params.id;
		if (id) {
			this.options.context.adId = id;
			this.isBusy = true;
			this.subscriptions.push(this.adsService
				.getAdByid(id)
				.subscribe((ad: Ad) => {
					this.ad = ad;
					this.owner = this.userService.currentUser.id === this.ad.user_id;
					this.isBusy = false;
					this.options.context.adPosition = this.ad.lastKnownPosition;
				}));
		}
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
	 * Obsługuje przycisk powrotu - nawiguje do poprzedniej strony.
	 */
	onBackButtonTap(): void {
		this.routerExtensions.backToPreviousPage();
	}

	/**
	 * Obsługuje przycisk 'Edit' - nawiguje do widoku edycji zgłoszenia i załącza dane zgłoszenia.
	 */
	onEditTap(): void {
		this.mapService.navigateTo(['/home/ad-edit', this.ad.id, this.ad.user_id, this.ad.name, this.ad.age, this.ad.image, this.ad.description]);
	}

	/**
	 * Obsługuje przycisk 'Ping' - nawiguje do widoku dodania informacji o napotkaniu i załącza id zgłoszenia.
	 */
	onPingTap(): void {
		this.mapService.navigateTo(['/map/ping', this.ad.id]);
	}

	/**
	 * Obsługuje przycisk 'Show route' - wywołuje okno modalne ze ścieżką i przekazuje parametry konfiguracyjne.
	 */
	async onShowRouteTap() {
		await this.modalService.showModal(MapModalRootComponent, this.options);
	}


	/**
	 * Obsługuje zdarzenie cofnięcia się z innego widoku do tego komponentu
	 * @param data - Dane wygenerowane ze zdarzenia nawigacji
	 */
	onNavigatedTo(data: NavigatedData) {
		if (data.isBackNavigation) {
			this.isBusy = true;
			this.subscriptions.push(this.adsService
				.getAdByid(this.ad.id)
				.subscribe((ad: Ad) => {
					this.ad = ad;
					this.owner = this.userService.currentUser.id === this.ad.user_id;
					this.isBusy = false;
				}));
		}
	}

}
