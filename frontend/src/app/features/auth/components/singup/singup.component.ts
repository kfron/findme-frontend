import { Component, OnDestroy } from '@angular/core';
import { TextField } from '@nativescript/core';
import { Subscription } from 'rxjs';
import { User } from '../../../../shared/models/auth.model';
import { UserService } from '../../../../shared/services/user.service';
import { MapService } from './../../../../shared/services/map.service';

@Component({
	moduleId: module.id,
	selector: 'fm-singup',
	templateUrl: './singup.component.html',
	styleUrls: ['./singup.component.scss']
})
export class SingupComponent implements OnDestroy {
	private subscriptions: Subscription[] = [];
	private timeouts: NodeJS.Timeout[] = []

	email = '';
	password = '';
	confirmPassword = '';

	constructor(
		private userService: UserService,
		private mapService: MapService) { }

	ngOnDestroy(): void {
		while (this.subscriptions.length != 0) {
			const sub = this.subscriptions.pop();
			sub.unsubscribe();
		}
		while (this.timeouts.length != 0) {
			let timeout = this.timeouts.pop();
			clearTimeout(timeout);
			timeout = null;
		}
	}

	onSignupTap(): void {
		if (this.email && this.password && this.confirmPassword && this.password === this.confirmPassword) {
			this.subscriptions.push(this.userService.signup({ email: this.email, password: this.password } as User)
				.subscribe({
					error: (err) => {
						console.log(err.error);
						alert({
							title: 'Find Me',
							okButtonText: 'OK',
							message: err.error.message
						});
						this.email = '';
						this.password = '';
						this.confirmPassword = '';
					},
					complete: () => {
						alert({
							title: 'Find Me',
							okButtonText: 'OK',
							message: 'Signup was successful!'
						});
						this.mapService.navigateTo(['/home/']);
					}
				}));
		}

	}

	onReturnPress(args) {
		const textField = <TextField>args.object;

		// Hide keyboard
		this.timeouts.push(setTimeout(() => {
			textField.dismissSoftInput();
		}, 100));

		this[textField.className] = textField.text;
	}

	toggleForm() {
		this.mapService.navigateTo(['/auth']);
	}

}