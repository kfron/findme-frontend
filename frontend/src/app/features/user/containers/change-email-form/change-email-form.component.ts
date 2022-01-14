import { Component, OnDestroy, ViewChild } from '@angular/core';
import { RadDataFormComponent } from 'nativescript-ui-dataform/angular';
import { Subscription } from 'rxjs';
import { UserService } from '~/app/shared/services/user.service';
import * as metadata from './emailMetadata.json';


@Component({
	moduleId: module.id,
	selector: 'fm-change-email-form',
	templateUrl: './change-email-form.component.html',
	styleUrls: ['./change-email-form.component.scss']
})
export class ChangeEmailFormComponent implements OnDestroy {
	private subscriptions: Subscription[] = []

	@ViewChild('changeEmailForm') changeEmailForm: RadDataFormComponent;

	emailMetadata = JSON.parse(JSON.stringify(metadata));
	data = { email: '' };

	constructor(
		private userService: UserService
	) { }

	ngOnDestroy(): void {
		while (this.subscriptions.length != 0) {
			const sub = this.subscriptions.pop();
			sub.unsubscribe();
		}
	}

	async validateAndCommit() {
		const isValid = await this.changeEmailForm.dataForm.validateAndCommitAll();

		if (isValid) {
			this.subscriptions.push(
				this.userService.changeEmail(this.data.email)
					.subscribe()
			);
			
			this.data = { email: '' };

			alert({
				title: 'Success!',
				okButtonText: 'OK',
				message: 'Email changed.'
			});
		}
	}
}
