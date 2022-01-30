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

	/**
	 * Obsługa przycisku powrotu - nawiguje do poprzedniej strony.
	 */
	onBackButtonTap() {
		this.routerExtensions.backToPreviousPage();
	}

	/**
	 * Obsługa przycisku powrotu - nawiguje do widoku edycji danych użytkownika.
	 */
	onEditTap() {
		this.mapService.navigateTo(['/user/edit']);
	}

	/**
	 * Obsługa przycisku powrotu - nawiguje do widoku zgłoszeń użytkownika.
	 */
	onMyAdsTap() {
		this.mapService.navigateTo(['/user/ads']);
	}

	/**
	 * Obsługa przycisku powrotu - nawiguje do widok uzgłoszeń, przy których użytkownik pomagał.
	 */
	onMyPingsTap() {
		this.mapService.navigateTo(['/user/pings']);
	}

	/**
	 * Obsługa przycisku powrotu - wylogowuje użytkownika i nawiguje do widoku logowania.
	 */
	onLogoutTap() {
		this.userService.currentUser = undefined;
		this.mapService.navigateTo(['/auth']);
	}
}
