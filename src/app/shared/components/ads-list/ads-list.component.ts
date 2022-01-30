import { Component, Input, OnInit } from '@angular/core';
import { ObservableArray } from '@nativescript/core';
import { Position } from 'nativescript-google-maps-sdk';
import { ListViewEventData } from 'nativescript-ui-listview';
import { Subscription } from 'rxjs';
import { LocationService } from '../../services/location.service';
import { Ad } from './../../models/ads.model';
import { MapService } from './../../services/map.service';

@Component({
	moduleId: module.id,
	selector: 'fm-ads-list',
	templateUrl: './ads-list.component.html',
	styleUrls: ['./ads-list.component.scss']
})
export class AdsListComponent implements OnInit {
	private subscriptions: Subscription[] = []

	@Input() emptyText;
	@Input() ads: ObservableArray<Ad>;
	
	currentPosition: Position;

	constructor(
		private mapService: MapService,
		private locationService: LocationService
	) { }

	/**
	 * Pobiera lokalizację urządzenia oraz rozpoczyna obserwację pod kątem jej zmian.
	 */
	async ngOnInit() {
		this.currentPosition = await this.locationService.getCurrentLocation();

		this.subscriptions.push(
			this.locationService.position$.subscribe(
				(val) => { this.currentPosition = val; }
			)
		);
	}

	/**
	 * Obsługuje naciśnięcie elementu na liście. Nawiguje do widoku szczegółowego.
	 * 
	 * @param args 
	 */
	onAdItemTap(args: ListViewEventData) {
		const tappedAdItem = (args.view.bindingContext as Ad);
		this.mapService.navigateTo(['/home/ad-details', tappedAdItem.id]);
	}

}
