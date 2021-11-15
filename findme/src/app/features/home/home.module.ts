import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { MissingPetAdListComponent } from './containers/missing-pet-ad-list/missing-pet-ad-list.component';
import { HomeRoutingModule } from './home-routing.module';

const components = [
  MissingPetAdListComponent
]

@NgModule({
  declarations: components,
  imports: [HomeRoutingModule],
  schemas: [NO_ERRORS_SCHEMA]
})
export class HomeModule { }
