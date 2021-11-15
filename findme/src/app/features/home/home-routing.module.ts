import { NgModule } from '@angular/core';
import { Routes } from '@angular/router';
import { NativeScriptRouterModule } from '@nativescript/angular';
import { MissingPetAdDetailsComponent } from './containers/missing-pet-ad-details/missing-pet-ad-details.component';
import { MissingPetAdListComponent } from './containers/missing-pet-ad-list/missing-pet-ad-list.component';


const routes: Routes = [
  { path: '', component: MissingPetAdListComponent },
  { path: 'ad-details/:id', component: MissingPetAdDetailsComponent }
]

@NgModule({
  imports: [NativeScriptRouterModule.forChild(routes)],
  exports: [NativeScriptRouterModule],
})
export class HomeRoutingModule {}
