import { Component, OnDestroy } from '@angular/core';
import { RouterExtensions } from '@nativescript/angular';
import { TextField } from '@nativescript/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../../auth.service';
import { User } from './../../auth.model';

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

	constructor(private authService: AuthService, private routerExtensions: RouterExtensions) { }

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
			this.subscriptions.push(this.authService.signup({ email: this.email, password: this.password, is_admin: false } as User)
				.subscribe({
					next: (res) => {
						this.authService.currentUser = res;
						this.routerExtensions.navigate(['/home']);
					},
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
					}
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
		this.routerExtensions.navigate(['/auth']);
	}

}
