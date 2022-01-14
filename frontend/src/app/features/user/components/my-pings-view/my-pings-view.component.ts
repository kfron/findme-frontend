import { Position } from 'nativescript-google-maps-sdk';
import { ObservableArray } from '@nativescript/core';
import { Subscription } from 'rxjs';
import { RouterExtensions } from '@nativescript/angular';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Ad } from '~/app/shared/models/ads.model';
import { UserService } from '~/app/shared/services/user.service';

@Component({
	moduleId: module.id,
	selector: 'fm-my-pings-view',
	templateUrl: './my-pings-view.component.html',
	styleUrls: ['./my-pings-view.component.scss']
})
export class MyPingsViewComponent implements OnInit, OnDestroy {
	private subscriptions: Subscription[] = []

	ads: ObservableArray<Ad> = new ObservableArray<Ad>([])
	isBusy = false;
	emptyText = `No active ads that you've pinged.`;

	constructor(
		private userService: UserService,
		private routerExtensions: RouterExtensions
	) { }

	ngOnInit(): void {
		this.isBusy = true;
		this.subscriptions.push(this.userService
			.getMyPings()
			.subscribe((ads: any[]) => {
				ads.map(val => {
					val.found_at = new Date(val.found_at);
					val.lastKnownPosition = Position.positionFromLatLng(val.lat, val.lon);
					val.lat = undefined;
					val.lon = undefined;
				});
				this.ads = new ObservableArray(ads as Ad[]);
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

	onBackButtonTap() {
		this.routerExtensions.backToPreviousPage();
	}

}
