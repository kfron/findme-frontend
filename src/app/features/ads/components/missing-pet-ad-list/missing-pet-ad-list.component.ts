import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigatedData, ObservableArray, Page } from '@nativescript/core';
import { Position } from 'nativescript-google-maps-sdk';
import { Subscription } from 'rxjs';
import { Ad } from '~/app/shared/models/ads.model';
import { LocationService } from '../../../../shared/services/location.service';
import { MapService } from '../../../../shared/services/map.service';
import { AdsService } from '../../ads.service';

@Component({
	moduleId: module.id,
	selector: 'fm-missing-pet-ad-list',
	templateUrl: './missing-pet-ad-list.component.html',
	styleUrls: ['./missing-pet-ad-list.component.scss']
})
export class MissingPetAdListComponent implements OnInit, OnDestroy {

	private subscriptions: Subscription[] = []

	currentPosition: Position
	ads: ObservableArray<Ad> = new ObservableArray<Ad>([])
	isBusy = false;
	sortByProximity = false;
	sortByProximityAsc = true;
	sortByAge = false;
	sortByAgeAsc = true;
	sortByDate = false;
	sortByDateAsc = true;
	toggleRadiusText: string
	emptyText: string

	constructor(
		private adsService: AdsService,
		private locationService: LocationService,
		private page: Page,
		private mapService: MapService) {
		this.page.on(Page.navigatedToEvent, (data: NavigatedData) => this.onNavigatedTo(data));
	}

	/**
	 * Aktualizuje pola tekstowe z użyciem obecnie ustalonego promienia poszukiwań
	 */
	private setTexts() {
		this.toggleRadiusText = `Toggle radius (${this.mapService.searchRadius} km)`;
		this.emptyText = `No ads in ${this.mapService.searchRadius} km radius`;
	}

	/**
	 * Uruchamiana w momencie inicjalizacji komponentu
	 * Inicjalizuje pola tekstowe oraz lokalizację i pobiera listę ogłoszeń z okolicy
	 */
	async ngOnInit() {
		this.setTexts();
		this.currentPosition = await this.locationService.getCurrentLocation();

		this.subscriptions.push(
			this.locationService.position$.subscribe(
				val => this.currentPosition = val
			)
		);
		this.isBusy = true;
		this.subscriptions.push(this.adsService
			.getAdsList(this.currentPosition.latitude, this.currentPosition.longitude)
			.subscribe((ads: Ad[]) => {
				this.ads = new ObservableArray(ads);
				this.isBusy = false;
			})
		);
	}

	/**
	 * Przerywa istniejące subskrypcje, gdy komponent zostaje zniszczony
	 */
	ngOnDestroy(): void {
		while (this.subscriptions.length != 0) {
			const sub = this.subscriptions.pop();
			sub.unsubscribe();
		}
	}

	/**
	 * Nawiguje do widoku tworzenia nowego ogłoszenia
	 */
	createNewAd() {
		this.mapService.navigateTo(['/home/ad-create']);
	}

	/**
	 * Obsługuje zdarzenie cofnięcia się z innego widoku do tego komponentu
	 * @param data - Dane wygenerowane ze zdarzenia nawigacji
	 */
	onNavigatedTo(data: NavigatedData) {
		if (data.isBackNavigation) {
			this.setTexts();
			this.isBusy = true;
			this.subscriptions.push(this.adsService
				.getAdsList(this.currentPosition.latitude, this.currentPosition.longitude)
				.subscribe((ads: Ad[]) => {
					this.ads = new ObservableArray(ads);
					this.isBusy = false;
				}));
		}
	}

	/**
	 * Obsługuje przycisk 'Map' - nawiguje do widoku interaktywnej mapy
	 */
	onMapButtonTap() {
		this.mapService.navigateTo(['/map/']);
	}

	/**
	 * Obsługuje przycisk 'Sort by date' - resetuje parametry sortowania,
	 * ustawia nowe i odpowiednio sortuje listę zgłoszeń
	 */
	onSortByDateTap() {
		if (this.sortByDate)
			this.sortByDateAsc = !this.sortByDateAsc;

		this.sortByDate = true;

		this.sortByAge = false;
		this.sortByAgeAsc = true;
		this.sortByProximity = false;
		this.sortByProximityAsc = true;

		this.ads = new ObservableArray<Ad>(
			this.ads.sort((a, b) =>
				this.sortByDateAsc ?
					b.found_at.valueOf() - a.found_at.valueOf() :
					a.found_at.valueOf() - b.found_at.valueOf())
		);

	}

	/**
	 * Obsługuje przycisk 'Sort by proximity' - resetuje parametry sortowania,
	 * ustawia nowe i odpowiednio sortuje listę zgłoszeń
	 */
	onSortByProximityTap() {
		if (this.sortByProximity)
			this.sortByProximityAsc = !this.sortByProximityAsc;

		this.sortByProximity = true;

		this.sortByAge = false;
		this.sortByAgeAsc = true;
		this.sortByDate = false;
		this.sortByDateAsc = true;

		this.ads = new ObservableArray<Ad>(
			this.ads.sort((a, b) =>
				this.sortByProximityAsc ?
					this.getDistance(a.lastKnownPosition, this.currentPosition) - this.getDistance(b.lastKnownPosition, this.currentPosition) :
					this.getDistance(b.lastKnownPosition, this.currentPosition) - this.getDistance(a.lastKnownPosition, this.currentPosition))
		);

	}

	/**
	 * Obsługuje przycisk 'Sort by age' - resetuje parametry sortowania,
	 * ustawia nowe i odpowiednio sortuje listę zgłoszeń
	 */
	onSortByAgeTap() {
		if (this.sortByAge)
			this.sortByAgeAsc = !this.sortByAgeAsc;

		this.sortByAge = true;

		this.sortByDate = false;
		this.sortByDateAsc = true;
		this.sortByProximity = false;
		this.sortByProximityAsc = true;

		this.ads = new ObservableArray<Ad>(this.ads.sort((a, b) => this.sortByAgeAsc ? a.age - b.age : b.age - a.age));
	}

	/**
	 * Oblicza przybliżoną odległość między dwoma punktami na kuli ziemskiej, z uwzględnieniem jej zakrzywienia
	 * 
	 * @param a - koordynaty pierwszego punktu na mapie
	 * @param b - koordynaty drugiego punktu na mapie
	 * @returns Przybliżoną rzeczywistą odległość pomiędzy dwoma punktami
	 */
	getDistance(a: Position, b: Position): number {
		const R = 6371.0710; // Radius of the Earth in miles
		const rlat1 = a.latitude * (Math.PI / 180); // Convert degrees to radians
		const rlat2 = b.latitude * (Math.PI / 180); // Convert degrees to radians
		const difflat = rlat2 - rlat1; // Radian difference (latitudes)
		const difflon = (b.longitude - a.longitude) * (Math.PI / 180); // Radian difference (longitudes)

		const d = 2 * R * Math.asin(Math.sqrt(Math.sin(difflat / 2) * Math.sin(difflat / 2) + Math.cos(rlat1) * Math.cos(rlat2) * Math.sin(difflon / 2) * Math.sin(difflon / 2)));
		return Math.round(d * 1000);
	}


	/**
	 * Obsługuje przycisk zmiany promienia poszukiwań - przełącza promień na kolejną wartość [0.5km, 1km, 5km]
	 * Aktualizuje pola tekstowe oraz pobiera ogłoszenia z okolicy z uwzględnieniem nowego zasięgu poszukiwań
	 */
	onToggleRadiusTapped() {
		this.mapService.toggleSearchRadius();
		this.setTexts();
		this.isBusy = true;
		this.subscriptions.push(this.adsService
			.getAdsList(this.currentPosition.latitude, this.currentPosition.longitude)
			.subscribe((ads: Ad[]) => {
				this.ads = new ObservableArray(ads);
				this.isBusy = false;
			}));
	}

	/**
	 * Obsługuje przycisk 'My profile' - nawiguje do widoku profilu użytkownika 
	 */
	onUserIconTap() {

		this.mapService.navigateTo(['/user/']);
	}

}
