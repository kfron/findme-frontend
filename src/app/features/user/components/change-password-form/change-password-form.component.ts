import { Component, OnDestroy, ViewChild } from '@angular/core';
import { RadDataFormComponent } from 'nativescript-ui-dataform/angular';
import { Subscription } from 'rxjs';
import { UserService } from '~/app/shared/services/user.service';
import * as metadata from './passwordMetadata.json';

@Component({
	moduleId: module.id,
	selector: 'fm-change-password-form',
	templateUrl: './change-password-form.component.html',
	styleUrls: ['./change-password-form.component.scss']
})
export class ChangePasswordFormComponent implements OnDestroy {
	private subscriptions: Subscription[] = []

	// dane konfiguracyjne formularza
	passwordMetadata = JSON.parse(JSON.stringify(metadata));
	data = { newPassword: '', confirmNewPassword: '' };

	constructor(
		private userService: UserService
	) { }

	/**
	 * Pobranie odniesienia do formularza stworzonego w pliku HTML.
	 */
	@ViewChild('changePasswordForm') changePasswordForm: RadDataFormComponent;

	/**
	 * Przerywa istniejące subskrypcje, gdy komponent zostaje zniszczony
	 */
	ngOnDestroy(): void {
		while (this.subscriptions.length != 0) {
			const sub = this.subscriptions.pop();
			sub.unsubscribe();
		}
	}

	/**
	 * Waliduje i aktualizuje pola formularza.
	 * Jeśli pola są poprawne, to wysyła żądanie zmiany hasła użytkownika.
	 * Poprawna weryfikacja powoduje wyświetlenie okna z informacją o sukcesie.
	 * Błędna weryfikacja resetuje pola formularza.
	 */
	validateAndCommit() {
		let isValid = true;

		const newPass = this.changePasswordForm.dataForm.getPropertyByName('newPassword');
		const confirmNewPass = this.changePasswordForm.dataForm.getPropertyByName('confirmNewPassword');
		if (newPass.valueCandidate.length === 0) {
			newPass.errorMessage = `Password cannot be empty.`;
			this.changePasswordForm.dataForm.notifyValidated('newPassword', false);
		} else if (newPass.valueCandidate.length > 50) {
			newPass.errorMessage = `Password cannot be longer than 50 characters.`;
			this.changePasswordForm.dataForm.notifyValidated('newPassword', false);
		} else {
			if (confirmNewPass.valueCandidate !== newPass.valueCandidate) {
				confirmNewPass.errorMessage = `Password and confirmation don't match.`;
				this.changePasswordForm.dataForm.notifyValidated('confirmNewPassword', false);
				isValid = false;
			} else {
				this.changePasswordForm.dataForm.notifyValidated('confirmNewPassword', true);
			}

			if (isValid) {
				this.changePasswordForm.dataForm.commitAll();

				this.subscriptions.push(
					this.userService.changePassword(this.data.newPassword)
						.subscribe()
				);

				this.data = { newPassword: '', confirmNewPassword: '' };

				alert({
					title: 'Success!',
					okButtonText: 'OK',
					message: 'Password changed.'
				});
			}
		}
	}
}
