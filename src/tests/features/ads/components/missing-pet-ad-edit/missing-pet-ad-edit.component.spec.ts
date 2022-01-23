import { Page } from '@nativescript/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterExtensions } from '@nativescript/angular';
import { of } from 'rxjs';
import { AdsService } from '~/app/features/ads/ads.service';
import { MapService } from '~/app/shared/services/map.service';
import { MissingPetAdEditComponent } from './../../../../../app/features/ads/components/missing-pet-ad-edit/missing-pet-ad-edit.component';

describe('MissingPetAdEditComponent', function () {
	let component: MissingPetAdEditComponent;
	let fixture: ComponentFixture<MissingPetAdEditComponent>;

	let mapService: jasmine.SpyObj<MapService>;
	let adsService: jasmine.SpyObj<AdsService>;
	let routerExtensions: jasmine.SpyObj<RouterExtensions>;
	let activatedRoute: jasmine.SpyObj<ActivatedRoute>;

	beforeEach(() => {
		TestBed.configureTestingModule({
			declarations: [MissingPetAdEditComponent],
			providers: [
				{ provide: MapService, useValue: jasmine.createSpyObj('MapService', ['navigateTo']) },
				{ provide: AdsService, useValue: jasmine.createSpyObj('AdsService', ['updateAdWithImage', 'updateAdWithoutImage', 'deleteAd']) },
				{ provide: RouterExtensions, useValue: jasmine.createSpyObj('RouterExtensions', ['backToPreviousPage']) },
				{ provide: ActivatedRoute, useValue: jasmine.createSpyObj('ActivatedRoute', [], { snapshot: { params: { name: 'Test', age: 6, image: 'test.jpg', description: 'Test dog' } } }) },
				{ provide: Page }
			]
		}).compileComponents();
		fixture = TestBed.createComponent(MissingPetAdEditComponent);
		component = fixture.componentInstance as MissingPetAdEditComponent;

		mapService = TestBed.inject(MapService) as jasmine.SpyObj<MapService>;
		adsService = TestBed.inject(AdsService) as jasmine.SpyObj<AdsService>;
		routerExtensions = TestBed.inject(RouterExtensions) as jasmine.SpyObj<RouterExtensions>;
		activatedRoute = TestBed.inject(ActivatedRoute) as jasmine.SpyObj<ActivatedRoute>;
	});

	it('#onDeleteTap should call for ad deletion and navigate to home', function (done: DoneFn) {
		adsService.deleteAd.and.returnValue(of({}));
		done();
		component.id = 1;

		component.onDeleteTap();

		expect(adsService.deleteAd).toHaveBeenCalledOnceWith(1);
	});
});