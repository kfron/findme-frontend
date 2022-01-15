import { Component, OnDestroy, OnInit, ViewContainerRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalDialogOptions, ModalDialogService, RouterExtensions } from '@nativescript/angular';
import { NavigatedData, Page } from '@nativescript/core';
import { Subscription } from 'rxjs';
import { Ad } from '~/app/shared/models/ads.model';
import { UserService } from '~/app/shared/services/user.service';
import { MapService } from './../../../../shared/services/map.service';
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
		private mapService: MapService,
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
				.subscribe((ad: Ad) => {
					this.ad = ad;
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
		this.mapService.navigateTo(['/home/ad-edit', this.ad.id, this.ad.user_id, this.ad.name, this.ad.age, this.ad.image, this.ad.description]);
	}

	onPingTap(): void {
		this.mapService.navigateTo(['/map/ping', this.ad.id]);
	}

	async onShowRouteTap() {
		await this.modalService.showModal(MapModalRootComponent, this.options);
	}

	onNavigatedTo(data: NavigatedData) {
		if (data.isBackNavigation) {
			this.isBusy = true;
			this.subscriptions.push(this.homeService
				.getAdByid(this.ad.id)
				.subscribe((ad: Ad) => {
					this.ad = ad;
					this.owner = this.userService.currentUser.id === this.ad.user_id;
					this.isBusy = false;
				}));
		}
	}

}
