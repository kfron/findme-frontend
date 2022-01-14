import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterExtensions } from '@nativescript/angular';
import { TextField } from '@nativescript/core';
import { Subscription } from 'rxjs';
import { UserService } from '~/app/shared/services/user.service';
import { User } from './../../../../shared/models/auth.model';
@Component({
	moduleId: module.id,
	selector: 'fm-user-edit',
	templateUrl: './user-edit.component.html',
	styleUrls: ['./user-edit.component.scss']
})
export class UserEditComponent implements OnInit, OnDestroy {
	private subscriptions: Subscription[] = []
	private timeouts: NodeJS.Timeout[] = []
	user: User;

	email = '';
	oldPassword = '';
	newPassword = '';
	confirmNewPassword = '';

	constructor(
		private routerExtensions: RouterExtensions,
		private userService: UserService
	) { }

	ngOnInit(): void {
		this.user = this.userService.currentUser;
	}

	ngOnDestroy(): void {
		while (this.timeouts.length != 0) {
			let timeout = this.timeouts.pop();
			clearTimeout(timeout);
			timeout = null;
		}
	}

	onLostFocus(args) {
		const textField = <TextField>args.object;

		this.timeouts.push(setTimeout(() => {
			textField.dismissSoftInput();
		}, 100));

		this[textField.className] = textField.text;
	}

	onChangeEmailTap() {
		this.subscriptions.push(this.userService.changeEmail(this.email).subscribe());
	}

	onChangePasswordTap() {
		this.subscriptions.push(this.userService.changePassword(this.newPassword).subscribe());
	}

	onBackButtonTap() {
		this.routerExtensions.backToPreviousPage();
	}

}
