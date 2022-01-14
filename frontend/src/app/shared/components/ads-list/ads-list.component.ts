import { Component, Input, OnInit } from '@angular/core';
import { RouterExtensions } from '@nativescript/angular';
import { ObservableArray } from '@nativescript/core';
import { Position } from 'nativescript-google-maps-sdk';
import { ListViewEventData } from 'nativescript-ui-listview';
import { Subscription } from 'rxjs';
import { LocationService } from '../../services/location.service';
import { Ad } from './../../models/ads.model';

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
		private routerExtensions: RouterExtensions,
		private locationService: LocationService
	) { }

	async ngOnInit() {
		this.currentPosition = await this.locationService.getCurrentLocation();

		this.subscriptions.push(
			this.locationService.position$.subscribe(
				(val) => { this.currentPosition = val; }
			)
		);
	}

	onAdItemTap(args: ListViewEventData) {
		const tappedAdItem = (args.view.bindingContext as Ad);
		this.routerExtensions.navigate(['/home/ad-details', tappedAdItem.id], {
			animated: true,
			transition: {
				name: 'slide',
				duration: 200,
				curve: 'ease',
			}
		});
	}

}
