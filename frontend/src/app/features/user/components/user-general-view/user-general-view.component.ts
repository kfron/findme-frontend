import { Component } from '@angular/core';
import { RouterExtensions } from '@nativescript/angular';
import { UserService } from '~/app/shared/services/user.service';

@Component({
	moduleId: module.id,
	selector: 'fm-user-general-view',
	templateUrl: './user-general-view.component.html',
	styleUrls: ['./user-general-view.component.scss']
})
export class UserGeneralViewComponent {

	constructor(
		private routerExtensions: RouterExtensions,
		private userService: UserService
	) { }

	onBackButtonTap() {
		this.routerExtensions.backToPreviousPage();
	}

	onEditTap() {
		this.routerExtensions.navigate(['/user/edit']);
	}

	onMyAdsTap() {
		this.routerExtensions.navigate(['/user/ads']);
	}

	onMyPingsTap() {
		this.routerExtensions.navigate(['/user/pings']);
	}

	onLogoutTap() {
		this.userService.currentUser = undefined;
		this.routerExtensions.navigateByUrl('/auth');
	}
}
