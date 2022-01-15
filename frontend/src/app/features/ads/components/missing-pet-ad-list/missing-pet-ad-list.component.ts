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
	toggleRadiusText = `Toggle radius (${this.mapService.searchRadius} km)`
	emptyText = `No ads in ${this.mapService.searchRadius} km radius`

	constructor(
		private adsService: AdsService,
		private locationService: LocationService,
		private page: Page,
		private mapService: MapService) {
		this.page.on(Page.navigatedToEvent, (data: NavigatedData) => this.onNavigatedTo(data));
	}

	async ngOnInit() {
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

	ngOnDestroy(): void {
		while (this.subscriptions.length != 0) {
			const sub = this.subscriptions.pop();
			sub.unsubscribe();
		}
	}

	createNewAd() {
		this.mapService.navigateTo(['/home/ad-create']);
	}

	onNavigatedTo(data: NavigatedData) {
		if (data.isBackNavigation) {
			this.emptyText = `No ads in ${this.mapService.searchRadius} km radius`;
			this.toggleRadiusText = `Toggle radius (${this.mapService.searchRadius} km)`;
			this.isBusy = true;
			this.subscriptions.push(this.adsService
				.getAdsList(this.currentPosition.latitude, this.currentPosition.longitude)
				.subscribe((ads: Ad[]) => {
					this.ads = new ObservableArray(ads);
					this.isBusy = false;
				}));
		}
	}

	onMapButtonTap() {
		this.mapService.navigateTo(['/map/']);
	}

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

	getDistance(a: Position, b: Position): number {
		const R = 6371.0710; // Radius of the Earth in miles
		const rlat1 = a.latitude * (Math.PI / 180); // Convert degrees to radians
		const rlat2 = b.latitude * (Math.PI / 180); // Convert degrees to radians
		const difflat = rlat2 - rlat1; // Radian difference (latitudes)
		const difflon = (b.longitude - a.longitude) * (Math.PI / 180); // Radian difference (longitudes)

		const d = 2 * R * Math.asin(Math.sqrt(Math.sin(difflat / 2) * Math.sin(difflat / 2) + Math.cos(rlat1) * Math.cos(rlat2) * Math.sin(difflon / 2) * Math.sin(difflon / 2)));
		return Math.round(d * 1000);
	}

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

	onToggleRadiusTapped() {
		this.mapService.toggleSearchRadius();
		this.emptyText = `No ads in ${this.mapService.searchRadius} km radius`;
		this.toggleRadiusText = `Toggle radius (${this.mapService.searchRadius} km)`;
		this.isBusy = true;
		this.subscriptions.push(this.adsService
			.getAdsList(this.currentPosition.latitude, this.currentPosition.longitude)
			.subscribe((ads: Ad[]) => {
				this.ads = new ObservableArray(ads);
				this.isBusy = false;
			}));
	}

	onUserIconTap() {

		this.mapService.navigateTo(['/user/']);
	}

}
