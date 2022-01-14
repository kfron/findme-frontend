import { SharedComponentsModule } from './../../shared/components/shared-components.module';
import { NativeScriptUIListViewModule } from 'nativescript-ui-listview/angular';
import { MyPingsViewComponent } from './components/my-pings-view/my-pings-view.component';
import { MyAdsViewComponent } from './components/my-ads-view/my-ads-view.component';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { NativeScriptCommonModule, NativeScriptHttpClientModule } from '@nativescript/angular';
import { NativeScriptLocalizeModule } from '@nativescript/localize/angular';
import { NativeScriptUIDataFormModule } from 'nativescript-ui-dataform/angular';
import { UserEditComponent } from './components/user-edit/user-edit.component';
import { UserGeneralViewComponent } from './components/user-general-view/user-general-view.component';
import { ChangeEmailFormComponent } from './containers/change-email-form/change-email-form.component';
import { ChangePasswordFormComponent } from './containers/change-password-form/change-password-form.component';
import { UserRoutingModule } from './user-routing.module';
import { PipesModule } from '~/app/shared/pipes/pipes.module';



const components = [
	UserGeneralViewComponent,
	UserEditComponent,
	ChangeEmailFormComponent,
	ChangePasswordFormComponent,
	MyAdsViewComponent,
	MyPingsViewComponent
];

const modules = [
	UserRoutingModule,
	NativeScriptCommonModule,
	NativeScriptLocalizeModule,
	NativeScriptHttpClientModule,
	NativeScriptUIDataFormModule,
	NativeScriptUIListViewModule,
	PipesModule,
	SharedComponentsModule
];

@NgModule({
	declarations: components,
	imports: modules,
	schemas: [NO_ERRORS_SCHEMA]
})
export class UserModule { }
