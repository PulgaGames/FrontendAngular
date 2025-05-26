import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MenuglobalComponent } from './modules/global/components/menuglobal/menuglobal.component';

const routes: Routes = [
  {
    path: '',
    component: MenuglobalComponent,
    loadChildren: () => import('./routes.module').then(m => m.RoutesModule),
    
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
