import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MissingPetAdListComponent } from './missing-pet-ad-list.component';

describe('MissingPetAdListComponent', () => {
  let component: MissingPetAdListComponent;
  let fixture: ComponentFixture<MissingPetAdListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MissingPetAdListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MissingPetAdListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
