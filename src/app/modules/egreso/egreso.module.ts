import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { IndexComponent } from './components/index/index.component';
import { FormComponent } from './components/form/form.component';
import { GlobalModule } from '../global/global.module';



@NgModule({
  declarations: [
    IndexComponent,
    FormComponent
  ],
  imports: [
    CommonModule,
    MatToolbarModule,
    GlobalModule
  ]
})
export class EgresoModule { }
