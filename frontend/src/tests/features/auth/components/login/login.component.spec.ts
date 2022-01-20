import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { User } from '~/app/shared/models/auth.model';
import { MapService } from '~/app/shared/services/map.service';
import { LoginComponent } from './../../../../../app/features/auth/components/login/login.component';
import { UserService } from './../../../../../app/shared/services/user.service';

describe('LoginComponent', function () {
	let component: LoginComponent;
	let fixture: ComponentFixture<LoginComponent>;
	let userService: jasmine.SpyObj<UserService>;
	let mapService: jasmine.SpyObj<MapService>;

	beforeEach(() => {
		TestBed.configureTestingModule({
			declarations: [LoginComponent],
			providers: [
				{ provide: UserService, useValue: jasmine.createSpyObj('UserService', ['login']) },
				{ provide: MapService, useValue: jasmine.createSpyObj('MapService', ['navigateTo']) }
			]
		}).compileComponents();
		fixture = TestBed.createComponent(LoginComponent);
		component = fixture.componentInstance as LoginComponent;

		userService = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
		mapService = TestBed.inject(MapService) as jasmine.SpyObj<MapService>;
	});

	it('#login should call userService login when credentials are valid', function (done: DoneFn) {
		component.email = 'test';
		component.password = 'test';
		userService.login.and.returnValue(of({} as User));

		component.login();

		expect(userService.login).toHaveBeenCalledOnceWith('test', 'test');

		done();
	});

	it('#login should not call userService login when credentials are invalid', function (done: DoneFn) {
		component.email = '';
		component.password = '';
		userService.login.and.returnValue(of({} as User));

		component.login();

		expect(userService.login).toHaveBeenCalledTimes(0);

		done();
	});

	it('#toggleForm should call for navigation', function () {
		mapService.navigateTo.and.returnValue();

		component.toggleForm();

		expect(mapService.navigateTo).toHaveBeenCalledTimes(1);
	});

});