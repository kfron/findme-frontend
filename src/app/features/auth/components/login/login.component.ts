import { Component, OnDestroy, ViewChild, OnInit } from '@angular/core';
import { RadDataFormComponent } from 'nativescript-ui-dataform/angular';
import { Subscription } from 'rxjs';
import { UserService } from '../../../../shared/services/user.service';
import { MapService } from './../../../../shared/services/map.service';
import * as metadata from './loginMetadata.json';


@Component({
	moduleId: module.id,
	selector: 'fm-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {

	private subscriptions: Subscription[] = [];

	// dane konfiguracyjne formularza
	loginMetadata = JSON.parse(JSON.stringify(metadata));

	data;

	constructor(
		private userService: UserService,
		private mapService: MapService) { }

	/**
	 * Pobranie odniesienia do formularza stworzonego w pliku HTML.
	 */
	@ViewChild('loginForm') loginForm: RadDataFormComponent;

	/**
	 * Inicjalizuje dane formularza.
	 */
	ngOnInit(): void {
		this.data = { email: '', password: '' };
	}

	/**
	 * Przerywa istniejące subskrypcje, gdy komponent zostaje zniszczony
	 */
	ngOnDestroy(): void {
		while (this.subscriptions.length != 0) {
			let sub = this.subscriptions.pop();
			sub.unsubscribe();
			sub = null;
		}
	}

	/**
	 * Waliduje i aktualizuje pola formularza.
	 * Jeśli pola są poprawne, to wysyła żądanie weryfikacji użytkownika.
	 * Poprawna weryfikacja przenosi do widoku głównego.
	 * Błędna weryfikacja resetuje pola formularza.
	 */
	async validateAndCommit() {
		const isValid = await this.loginForm.dataForm.validateAndCommitAll();

		if (isValid) {
			this.subscriptions.push(
				this.userService.login(this.data.email, this.data.password)
					.subscribe({
						error: (err) => {
							alert({
								title: 'Find Me',
								okButtonText: 'OK',
								message: err.error.message
							});
							if (err.error.message !== 'Incorrect password.') {
								this.data = { email: '', password: this.data.password };
							}
							this.data = { email: '', password: '' };
							this.loginForm.dataForm.commitAll();
						},
						complete: () => {
							this.data = { email: '', password: '' };
							this.mapService.navigateTo(['/home/']);
						}
					})
			);

		}
	}

	/**
	 * Nawiguje do widoku rejestracji.
	 */
	toggleForm() {
		this.mapService.navigateTo(['/auth/signup']);
	}

}
