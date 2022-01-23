import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { NativeScriptCommonModule, NativeScriptHttpClientModule } from '@nativescript/angular';
import { NativeScriptLocalizeModule } from '@nativescript/localize/angular';
import { NativeScriptUIDataFormModule } from 'nativescript-ui-dataform/angular';
import { NativeScriptUIListViewModule } from 'nativescript-ui-listview/angular';
import { SharedComponentsModule } from '../../shared/components/shared-components.module';
import { PipesModule } from '../../shared/pipes/pipes.module';
import { AdsRoutingModule } from './ads-routing.module';
import { MapModalRootComponent } from './components/map-modal-root/map-modal-root.component';
import { MapModalComponent } from './components/map-modal/map-modal.component';
import { MissingPetAdCreateComponent } from './components/missing-pet-ad-create/missing-pet-ad-create.component';
import { MissingPetAdDetailsComponent } from './components/missing-pet-ad-details/missing-pet-ad-details.component';
import { MissingPetAdEditComponent } from './components/missing-pet-ad-edit/missing-pet-ad-edit.component';
import { MissingPetAdListComponent } from './components/missing-pet-ad-list/missing-pet-ad-list.component';

const components = [
	MissingPetAdListComponent,
	MissingPetAdDetailsComponent,
	MissingPetAdCreateComponent,
	MissingPetAdEditComponent,
	MapModalComponent,
	MapModalRootComponent
];

const modules = [
	AdsRoutingModule,
	NativeScriptCommonModule,
	NativeScriptUIListViewModule,
	NativeScriptLocalizeModule,
	NativeScriptHttpClientModule,
	NativeScriptUIDataFormModule,
	PipesModule,
	SharedComponentsModule
];

@NgModule({
	declarations: components,
	imports: modules,
	schemas: [NO_ERRORS_SCHEMA]
})
export class AdsModule { }
