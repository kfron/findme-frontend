import { Component } from '@angular/core';
import { RouterExtensions } from '@nativescript/angular';
@Component({
	moduleId: module.id,
	selector: 'fm-user-edit',
	templateUrl: './user-edit.component.html',
	styleUrls: ['./user-edit.component.scss']
})
export class UserEditComponent {
	constructor(
		private routerExtensions: RouterExtensions
	) { }

	/**
	 * Obsługa przycisku powrotu - nawiguje do poprzedniej strony.
	 */
	onBackButtonTap() {
		this.routerExtensions.backToPreviousPage();
	}

}
