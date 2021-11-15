import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { HomeComponent } from './components/home.component'
import { MissingPetAdListComponent } from './containers/missing-pet-ad-list/missing-pet-ad-list.component'

const components = [
  HomeComponent,
  MissingPetAdListComponent
]

@NgModule({
  declarations: components,
  imports: [],
  schemas: [NO_ERRORS_SCHEMA]
})
export class HomeModule { }
