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

	// dane konfiguracyjne formularza
	emailMetadata = JSON.parse(JSON.stringify(metadata));
	data = { email: '' };

	constructor(
		private userService: UserService
	) { }

	/**
	 * Pobranie odniesienia do formularza stworzonego w pliku HTML.
	 */
	@ViewChild('changeEmailForm') changeEmailForm: RadDataFormComponent;

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
	 * Jeśli pola są poprawne, to wysyła żądanie zmiany maila użytkownika.
	 * Poprawna weryfikacja powoduje wyświetlenie okna z informacją o sukcesie.
	 * Błędna weryfikacja resetuje pola formularza.
	 */	
	async validateAndCommit() {
		const isValid = await this.changeEmailForm.dataForm.validateAndCommitAll();

		if (isValid) {
			this.subscriptions.push(
				this.userService.changeEmail(this.data.email)
					.subscribe({
						error: (err) => {
							alert({
								title: 'Find Me',
								okButtonText: 'OK',
								message: err.error.message
							});
							this.data = { email: '' };
						},
						complete: () => {
							this.data = { email: '' };
							alert({
								title: 'Success!',
								okButtonText: 'OK',
								message: 'Email changed.'
							});
						}
					})
			);

		}
	}
}
