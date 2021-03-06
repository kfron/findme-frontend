import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { RadDataFormComponent } from 'nativescript-ui-dataform/angular';
import { Subscription } from 'rxjs';
import { User } from '~/app/shared/models/auth.model';
import { UserService } from '../../../../shared/services/user.service';
import { MapService } from './../../../../shared/services/map.service';
import * as metadata from './signupMetadata.json';

@Component({
	moduleId: module.id,
	selector: 'fm-singup',
	templateUrl: './singup.component.html',
	styleUrls: ['./singup.component.scss']
})
export class SingupComponent implements OnInit, OnDestroy {
	private subscriptions: Subscription[] = [];

	// dane konfiguracyjne formularza
	signupMetadata = JSON.parse(JSON.stringify(metadata));

	data;

	constructor(
		private userService: UserService,
		private mapService: MapService) { }

	/**
	 * Pobranie odniesienia do formularza stworzonego w pliku HTML.
	 */
	@ViewChild('signupForm') signupForm: RadDataFormComponent;
	
	/**
	 * Inicjalizuje dane formularza.
	 */
	ngOnInit(): void {
		this.data = { email: '', password: '', confirmPassword: '' };
	}

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
	 * Jeśli pola są poprawne, to wysyła żądanie rejestracji użytkownika.
	 * Poprawna weryfikacja przenosi do widoku głównego.
	 * Błędna weryfikacja resetuje pola formularza.
	 */	
	async validateAndCommit() {
		let isValid = true;

		const pass = this.signupForm.dataForm.getPropertyByName('password');
		const confirmPass = this.signupForm.dataForm.getPropertyByName('confirmPassword');

		if (confirmPass.valueCandidate !== pass.valueCandidate) {
			confirmPass.errorMessage = `Password and confirmation don't match`;
			this.signupForm.dataForm.notifyValidated('confirmPassword', false);
			isValid = false;
		} else {
			this.signupForm.dataForm.notifyValidated('confirmPassword', true);
		}

		isValid = isValid && (await this.signupForm.dataForm.validateAll()).valueOf();
		if (isValid) {
			this.signupForm.dataForm.commitAll();

			this.subscriptions.push(
				this.userService.signup({ email: this.data.email, password: this.data.password } as User)
					.subscribe({
						error: (err) => {
							console.log(err.error);
							alert({
								title: 'Find Me',
								okButtonText: 'OK',
								message: err.error.message
							});
							this.data.email = '';
							this.data.password = '';
							this.data.confirmPassword = '';
						},
						complete: () => {
							alert({
								title: 'Find Me',
								okButtonText: 'OK',
								message: 'Signup was successful!'
							});
							this.mapService.navigateTo(['/home/']);
						}
					})
			);
		}
	}

	/**
	 * Nawiguje do widoku logowania.
	 */
	toggleForm() {
		this.mapService.navigateTo(['/auth']);
	}

}
