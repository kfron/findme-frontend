import { ViewContainerRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalDialogService, RouterExtensions } from '@nativescript/angular';
import { Page } from '@nativescript/core';
import { AdsService } from '~/app/features/ads/ads.service';
import { MissingPetAdCreateComponent } from '~/app/features/ads/components/missing-pet-ad-create/missing-pet-ad-create.component';
import { User } from '~/app/shared/models/auth.model';
import { UserService } from '~/app/shared/services/user.service';

describe('MissingPetAdCreateComponent', function () {
	let component: MissingPetAdCreateComponent;
	let fixture: ComponentFixture<MissingPetAdCreateComponent>;

	let userService: jasmine.SpyObj<UserService>;
	let adsService: jasmine.SpyObj<AdsService>;
	let routerExtensions: jasmine.SpyObj<RouterExtensions>;
	let modalService: jasmine.SpyObj<ModalDialogService>;
	let vcRef: ViewContainerRef;

	beforeEach(() => {
		TestBed.configureTestingModule({
			declarations: [MissingPetAdCreateComponent],
			providers: [
				{ provide: UserService, useValue: jasmine.createSpyObj('UserService', [], { currentUser: { id: 1 } as User }) },
				{ provide: AdsService, useValue: jasmine.createSpyObj('AdsService', ['getAdByid']) },
				{ provide: RouterExtensions, useValue: jasmine.createSpyObj('RouterExtensions', ['backToPreviousPage']) },
				{ provide: ModalDialogService, useValue: jasmine.createSpyObj('ModalDialogService', ['showModal']) },
				{ provide: ViewContainerRef },
				{ provide: Page }
			]
		}).compileComponents();
		fixture = TestBed.createComponent(MissingPetAdCreateComponent);
		component = fixture.componentInstance as MissingPetAdCreateComponent;

		userService = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
		adsService = TestBed.inject(AdsService) as jasmine.SpyObj<AdsService>;
		vcRef = TestBed.inject(ViewContainerRef);
		modalService = TestBed.inject(ModalDialogService) as jasmine.SpyObj<ModalDialogService>;
		routerExtensions = TestBed.inject(RouterExtensions) as jasmine.SpyObj<RouterExtensions>;
	});

	it('#positionHandleTap should open a new modal and properly handle the result', function (done: DoneFn) {
		const chosenPosition = { latitude: 50, longitude: 20 };
		const editor = jasmine.createSpyObj('any', ['notifyValueChanged']);
		component.ad = { lastKnownPosition: '0 0' };

		modalService.showModal.and.resolveTo(chosenPosition);
		editor.notifyValueChanged.and.returnValue();
		spyOn(component, 'positionUpdateEditorValue').and.returnValue();

		component.positionHandleTap(null, editor)
			.then(() => {
				expect(modalService.showModal).toHaveBeenCalledTimes(1);
				expect(component.ad.lastKnownPosition).toEqual(chosenPosition.latitude + ' ' + chosenPosition.longitude);
			}
			);
		done();
	});
});