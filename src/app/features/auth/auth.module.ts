import { NativeScriptUIDataFormModule } from 'nativescript-ui-dataform/angular';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { NativeScriptCommonModule, NativeScriptHttpClientModule } from '@nativescript/angular';
import { NativeScriptLocalizeModule } from '@nativescript/localize/angular';
import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from './components/login/login.component';
import { SingupComponent } from './components/singup/singup.component';

const components = [
	LoginComponent,
	SingupComponent
];

const modules = [
	AuthRoutingModule,
	NativeScriptCommonModule,
	NativeScriptLocalizeModule,
	NativeScriptHttpClientModule,
	NativeScriptUIDataFormModule,
];

@NgModule({
	declarations: components,
	imports: modules,
	schemas: [NO_ERRORS_SCHEMA]
})
export class AuthModule { }
