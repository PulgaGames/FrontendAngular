import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IndexComponent } from './components/index/index.component';
import { MenuglobalComponent } from './components/menuglobal/menuglobal.component';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {RouterModule,Routes} from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatTableModule} from '@angular/material/table';
import { MatTableDataSource } from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatTooltipModule} from '@angular/material/tooltip';
import {ToastrModule} from 'ngx-toastr';
import { ToastrService } from 'ngx-toastr';
import {MatDialogModule} from '@angular/material/dialog';
import {MatRadioModule} from '@angular/material/radio';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { HttpService } from 'src/app/services/http.service';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';






@NgModule({
  declarations: [
    IndexComponent,
    MenuglobalComponent
  ],
  imports: [
    
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatIconModule,
    MatCardModule,
    MatButtonModule,
    HttpClientModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatPaginatorModule,
    FormsModule,
    MatTooltipModule,
    ToastrModule.forRoot({
      closeButton: true,
      progressBar: true,
      enableHtml: true,      
    }),
    MatDialogModule,
    MatRadioModule,
    MatSlideToggleModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatOptionModule,
    MatNativeDateModule,
    MatDatepickerModule
    
    
    

  ],
  exports: [
    HttpClientModule,
    MenuglobalComponent,
    MatIconModule,
    MatCardModule,
    RouterModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatPaginatorModule,
    FormsModule,
    MatTooltipModule,
    ToastrModule,
    MatDialogModule,
    MatRadioModule,
    MatSlideToggleModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatOptionModule,
    MatNativeDateModule,
    MatDatepickerModule, 
    

  ],
})
export class GlobalModule { }
