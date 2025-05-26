import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { FormComponent } from './components/form/form.component';
import { IndexComponent } from './components/index/index.component';
import { GlobalModule } from '../global/global.module';


@NgModule({
  declarations: [
    FormComponent,
    IndexComponent
  ],
  imports: [
    CommonModule,
    MatToolbarModule,
    GlobalModule
  ]
})
export class IngresoModule { }
