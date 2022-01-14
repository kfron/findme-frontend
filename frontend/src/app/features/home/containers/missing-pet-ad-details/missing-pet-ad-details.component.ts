import { Component, OnDestroy, OnInit, ViewContainerRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalDialogOptions, ModalDialogService, RouterExtensions } from '@nativescript/angular';
import { NavigatedData, Page } from '@nativescript/core';
import { Position } from 'nativescript-google-maps-sdk';
import { Subscription } from 'rxjs';
import { Ad } from '~/app/shared/models/ads.model';
import { UserService } from '~/app/shared/services/user.service';
import { MapModalRootComponent } from './../../components/map-modal-root/map-modal-root.component';
import { HomeService } from './../../home.service';

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
		private homeService: HomeService,
		private routerExtensions: RouterExtensions,
		private page: Page,
		private modalService: ModalDialogService,
		private vcRef: ViewContainerRef) {
		this.page.on(Page.navigatedToEvent, (data: NavigatedData) => this.onNavigatedTo(data));
	}

	ad: Ad = undefined

	ngOnInit(): void {
		const id = +this.activatedRoute.snapshot.params.id;
		if (id) {
			this.options.context.adId = id;
			this.isBusy = true;
			this.subscriptions.push(this.homeService
				.getAdByid(id)
				.subscribe((ads: any[]) => {
					ads.map(val => {
						val.found_at = new Date(val.found_at);
						val.lastKnownPosition = Position.positionFromLatLng(val.lat, val.lon);
						val.lat = undefined;
						val.lon = undefined;
					});
					this.ad = ads[0];
					this.owner = this.userService.currentUser.id === this.ad.user_id;
					this.isBusy = false;
					this.options.context.adPosition = this.ad.lastKnownPosition;
				}));
		}
	}

	ngOnDestroy(): void {
		while (this.subscriptions.length != 0) {
			const sub = this.subscriptions.pop();
			sub.unsubscribe();
		}
	}

	onBackButtonTap(): void {
		this.routerExtensions.backToPreviousPage();
	}

	onEditTap(): void {
		this.routerExtensions.navigate(['/home/ad-edit', this.ad.id, this.ad.user_id, this.ad.name, this.ad.age, this.ad.image, this.ad.description], {
			animated: true,
			transition: {
				name: 'slide',
				duration: 200,
				curve: 'ease',
			}
		});
	}

	onPingTap(): void {
		this.routerExtensions.navigate(['/map/ping', this.ad.id], {
			animated: true,
			transition: {
				name: 'slide',
				duration: 200,
				curve: 'ease',
			}
		});
	}

	async onShowRouteTap() {
		await this.modalService.showModal(MapModalRootComponent, this.options);
	}

	onNavigatedTo(data: NavigatedData) {
		if (data.isBackNavigation) {
			this.isBusy = true;
			this.subscriptions.push(this.homeService
				.getAdByid(this.ad.id)
				.subscribe((ad: Ad[]) => {
					this.ad = ad[0];
					this.owner = this.userService.currentUser.id === this.ad.user_id;
					this.isBusy = false;
				}));
		}
	}

}
