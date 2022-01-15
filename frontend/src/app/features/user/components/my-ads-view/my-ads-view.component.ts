import { ListViewEventData } from 'nativescript-ui-listview';
import { ObservableArray } from '@nativescript/core';
import { Position } from 'nativescript-google-maps-sdk';
import { Subscription } from 'rxjs';
import { RouterExtensions } from '@nativescript/angular';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Ad } from '~/app/shared/models/ads.model';
import { UserService } from '~/app/shared/services/user.service';

@Component({
	moduleId: module.id,
	selector: 'fm-my-ads-view',
	templateUrl: './my-ads-view.component.html',
	styleUrls: ['./my-ads-view.component.scss']
})
export class MyAdsViewComponent implements OnInit, OnDestroy {
	private subscriptions: Subscription[] = []

	ads: ObservableArray<Ad> = new ObservableArray<Ad>([])
	isBusy = false;
	emptyText = `You don't have any active ads.`;

	constructor(
		private userService: UserService,
		private routerExtensions: RouterExtensions
	) { }

	ngOnInit(): void {
		this.isBusy = true;
		this.subscriptions.push(this.userService
			.getMyAds()
			.subscribe((ads: Ad[]) => {
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
