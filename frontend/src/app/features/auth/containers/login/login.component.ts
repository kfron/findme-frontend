import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterExtensions } from '@nativescript/angular';
import { TextField } from '@nativescript/core';
import { Subscription } from 'rxjs';
import { UserService } from './../../../../shared/services/user.service';

@Component({
	moduleId: module.id,
	selector: 'fm-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {

	private subscriptions: Subscription[] = [];
	private timeouts: NodeJS.Timeout[] = []

	email = '';
	password = '';

	constructor(private userService: UserService, private routerExtensions: RouterExtensions) { }

	ngOnInit(): void {
		this.email = 'test';
		this.password = 'test';
		this.login();

	}

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
					next: (res) => {
						this.userService.currentUser = res;
						this.routerExtensions.navigate(['/home/']);
					},
					error: (err) => {
						console.log(err.error.message);
						alert({
							title: 'Find Me',
							okButtonText: 'OK',
							message: err.error.message
						});
						if (err.error.message !== 'Incorrect password.') {
							this.email = '';
						}
						this.password = '';
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
		this.routerExtensions.navigate(['/auth/signup']);
	}

}
