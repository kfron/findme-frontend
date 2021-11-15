import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MissingPetAdDetailsComponent } from './missing-pet-ad-details.component';

describe('MissingPetAdDetailsComponent', () => {
  let component: MissingPetAdDetailsComponent;
  let fixture: ComponentFixture<MissingPetAdDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MissingPetAdDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MissingPetAdDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
