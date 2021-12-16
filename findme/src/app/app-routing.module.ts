import { NgModule } from '@angular/core'
import { Routes } from '@angular/router'
import { NativeScriptRouterModule } from '@nativescript/angular'

const routes: Routes = [
  { path: '', redirectTo: '/auth', pathMatch: 'full' },
  { 
    path: 'home',
    loadChildren: () => import('~/app/features/home/home.module').then((m) => m.HomeModule)
  },
  {
    path: 'auth',
    loadChildren: () => import('~/app/features/auth/auth.module').then((m) => m.AuthModule)
  }
]

@NgModule({
  imports: [NativeScriptRouterModule.forRoot(routes)],
  exports: [NativeScriptRouterModule],
})
export class AppRoutingModule {}
