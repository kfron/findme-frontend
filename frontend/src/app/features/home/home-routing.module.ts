import { MapModalComponent } from './components/map-modal/map-modal.component';
import { NgModule } from '@angular/core';
import { Routes } from '@angular/router';
import { NativeScriptRouterModule } from '@nativescript/angular';
import { MissingPetAdCreateComponent } from './containers/missing-pet-ad-create/missing-pet-ad-create.component';
import { MissingPetAdDetailsComponent } from './containers/missing-pet-ad-details/missing-pet-ad-details.component';
import { MissingPetAdEditComponent } from './containers/missing-pet-ad-edit/missing-pet-ad-edit.component';
import { MissingPetAdListComponent } from './containers/missing-pet-ad-list/missing-pet-ad-list.component';


const routes: Routes = [
	{ path: '', component: MissingPetAdListComponent },
	{
		path: 'ad-details/:id', component: MissingPetAdDetailsComponent,
		children: [{
			path: 'modal-view', component: MapModalComponent
		}]
	},
	{
		path: 'ad-create', component: MissingPetAdCreateComponent,
		children: [{
			path: 'modal-view', component: MapModalComponent
		}]
	},
	{ path: 'ad-edit/:id/:user_id/:name/:age/:image/:description', component: MissingPetAdEditComponent },

];

@NgModule({
	imports: [NativeScriptRouterModule.forChild(routes)],
	exports: [NativeScriptRouterModule],
})
export class HomeRoutingModule { }
