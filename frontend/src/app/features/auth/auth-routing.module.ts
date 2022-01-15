import { SingupComponent } from './components/singup/singup.component';
import { NgModule } from '@angular/core';
import { Routes } from '@angular/router';
import { NativeScriptRouterModule } from '@nativescript/angular';
import { LoginComponent } from './components/login/login.component';


const routes: Routes = [
	{ path: '', component: LoginComponent },
	{ path: 'signup', component: SingupComponent }
];

@NgModule({
	imports: [NativeScriptRouterModule.forChild(routes)],
	exports: [NativeScriptRouterModule],
})
export class AuthRoutingModule {}
