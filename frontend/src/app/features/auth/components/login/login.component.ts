import { Component, OnDestroy } from '@angular/core';
import { TextField } from '@nativescript/core';
import { Subscription } from 'rxjs';
import { UserService } from '../../../../shared/services/user.service';
import { MapService } from './../../../../shared/services/map.service';

@Component({
	moduleId: module.id,
	selector: 'fm-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnDestroy {

	private subscriptions: Subscription[] = [];
	private timeouts: NodeJS.Timeout[] = []

	email = '';
	password = '';

	constructor(
		private userService: UserService,
		private mapService: MapService) { }


	ngOnDestroy(): void {
		while (this.subscriptions.length != 0) {
			let sub = this.subscriptions.pop();
			sub.unsubscribe();
			sub = null;
		}
		while (this.timeouts.length != 0) {
			let timeout = this.timeouts.pop();
			clearTimeout(timeout);
			timeout = null;
		}
	}

	login(): void {
		if (this.email && this.password) {
			this.subscriptions.push(this.userService.login(this.email, this.password)
				.subscribe({
					next: (res) => this.userService.currentUser = res,
					error: (err) => {
						alert({
							title: 'Find Me',
							okButtonText: 'OK',
							message: err.error.message
						});
						if (err.error.message !== 'Incorrect password.') {
							this.email = '';
						}
						this.password = '';
					},
					complete: () => this.mapService.navigateTo(['/home/'])
				}));
		}
	}

	onReturnPress(args) {
		const textField = <TextField>args.object;

		this.timeouts.push(setTimeout(() => {
			textField.dismissSoftInput();
		}, 100));

		this[textField.className] = textField.text;
	}

	toggleForm() {
		this.mapService.navigateTo(['/auth/signup']);
	}

}
