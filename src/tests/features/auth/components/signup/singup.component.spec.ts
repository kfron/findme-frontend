import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RadDataFormComponent } from 'nativescript-ui-dataform/angular';
import { of } from 'rxjs';
import { User } from '~/app/shared/models/auth.model';
import { MapService } from '~/app/shared/services/map.service';
import { SingupComponent } from './../../../../../app/features/auth/components/singup/singup.component';
import { UserService } from './../../../../../app/shared/services/user.service';

describe('SingupComponent', function () {
	let component: SingupComponent;
	let fixture: ComponentFixture<SingupComponent>;
	let userService: jasmine.SpyObj<UserService>;
	let mapService: jasmine.SpyObj<MapService>;

	beforeEach(() => {
		TestBed.configureTestingModule({
			declarations: [SingupComponent],
			providers: [
				{ provide: UserService, useValue: jasmine.createSpyObj('UserService', ['signup']) },
				{ provide: MapService, useValue: jasmine.createSpyObj('MapService', ['navigateTo']) }
			]
		}).compileComponents();
		fixture = TestBed.createComponent(SingupComponent);
		component = fixture.componentInstance as SingupComponent;

		userService = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
		mapService = TestBed.inject(MapService) as jasmine.SpyObj<MapService>;
	});

	it('#onSignupTap should call userService signup when credentials are valid', function (done: DoneFn) {
		component.data = { email: 'test', password: 'test', confirmPassword: 'test' };
		const dataForm = {
			validateAll: () => new Promise((resolve) => {
				setTimeout(() => {
					resolve(true);
				}, 100);
			}),
			commitAll: () => { return; },
			getPropertyByName: (string) => { return { valueCandidate: null }; },
			notifyValidated: (...args) => { return; }
		};
		component.signupForm = { dataForm } as RadDataFormComponent;
		userService.signup.and.returnValue(of({} as User));

		component.validateAndCommit().then(
			() => {
				expect(userService.signup).toHaveBeenCalledOnceWith({ email: 'test', password: 'test' } as User);
			}
		);
		done();
	});


	it('#onSignupTap should not call userService login when credentials are invalid', function (done: DoneFn) {
		component.data = { email: 'test', password: 'test', confirmPassword: 'test' };
		const dataForm = {
			validateAll: () => new Promise((resolve) => {
				setTimeout(() => {
					resolve(false);
				}, 100);
			}),
			commitAll: () => { return; },
			getPropertyByName: (string) => { return { valueCandidate: null }; },
			notifyValidated: (...args) => { return; }
		};
		component.signupForm = { dataForm } as RadDataFormComponent;
		userService.signup.and.returnValue(of({} as User));

		component.validateAndCommit().then(
			() => {
				expect(userService.signup).toHaveBeenCalledTimes(0);
			}
		);
		done();
	});

	it('#toggleForm should call for navigation', function () {
		mapService.navigateTo.and.returnValue();

		component.toggleForm();

		expect(mapService.navigateTo).toHaveBeenCalledTimes(1);
	});

});