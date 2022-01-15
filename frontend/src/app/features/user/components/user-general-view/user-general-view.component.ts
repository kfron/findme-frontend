import { Component } from '@angular/core';
import { RouterExtensions } from '@nativescript/angular';
import { UserService } from '~/app/shared/services/user.service';
import { MapService } from './../../../../shared/services/map.service';

@Component({
	moduleId: module.id,
	selector: 'fm-user-general-view',
	templateUrl: './user-general-view.component.html',
	styleUrls: ['./user-general-view.component.scss']
})
export class UserGeneralViewComponent {

	constructor(
		private routerExtensions: RouterExtensions,
		private userService: UserService,
		private mapService: MapService
	) { }

	onBackButtonTap() {
		this.routerExtensions.backToPreviousPage();
	}

	onEditTap() {
		this.mapService.navigateTo(['/user/edit']);
	}

	onMyAdsTap() {
		this.mapService.navigateTo(['/user/ads']);
	}

	onMyPingsTap() {
		this.mapService.navigateTo(['/user/pings']);
	}

	onLogoutTap() {
		this.userService.currentUser = undefined;
		this.mapService.navigateTo(['/auth']);
	}
}
