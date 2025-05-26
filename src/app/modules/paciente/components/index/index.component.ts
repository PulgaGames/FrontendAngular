import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { PacienteHttpService } from 'src/app/services/pacientehttp.service';
import { FormComponent } from '../form/form.component';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';




@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {

  displayedColumns: string[] = ['cedula', 'nombre', 'direccion', 'correo', 'acciones'];
  dataSource = new MatTableDataSource<any>([]);
  searchSubject: Subject<string> = new Subject<string>();


  cantidadTotal= 0;
  cantidadPorPagina= 10;
  numeroPagina= 0;
  opcionesDePaginacion: number[]= [1, 5, 10, 25, 100];

  textoBusqueda= '';
  

  constructor(
    private PacienteHttpService: PacienteHttpService,
    private Toastr: ToastrService,
    public dialog:MatDialog
  ) { }

  ngOnInit(): void {
    console.log('Componente inicializado');
    this.searchSubject.pipe(
      debounceTime(500),         // Espera 500ms después del último evento
      distinctUntilChanged()     // Solo si el valor cambia
    ).subscribe((texto: string) => {
      this.textoBusqueda = texto;
      this.numeroPagina = 0;     // Reiniciar página al buscar
      this.LeerTodo();
    });
    this.LeerTodo();
  }

  LeerTodo(){
    this.PacienteHttpService.LeerTodo(this.cantidadPorPagina, this.numeroPagina, this.textoBusqueda)
    .subscribe({
      next: (respuesta: any) => { 
        this.dataSource.data = respuesta.datos.elemento;
        this.cantidadTotal = respuesta.datos.cantidadtotal;
      },
      error: (error) => {
        console.error('Error en la petición:', error);
      }
    });
  }
  cambiarPagina(event: any) {
    this.cantidadPorPagina = event.pageSize;
    this.numeroPagina = event.pageIndex;
    this.LeerTodo();
  }

  eliminar(pacienteId: number) {
    let confirmacion = confirm('¿Está seguro/a que desea eliminar el elemento?');
  
    if (confirmacion) {
      let ids = [pacienteId];
  
      this.PacienteHttpService.Eliminar(ids)
        .subscribe((respuesta: any) => {
          this.Toastr.success('Eliminado correctamente', 'Éxito');
          this.LeerTodo();
        });
    }
  }

  crearpaciente() {
    
      const dialogRef = this.dialog.open(FormComponent,{
        autoFocus: true,
        width: '700px',
        data:{
          tipo: "crear",
        }
      });
  
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          console.log(`Dialog result: ${result}`);
          this.LeerTodo(); // 🔥 Refrescar solo si se creó un egreso
    }
        
      });
}
actualizarpaciente(pacienteId: number) {
  this.PacienteHttpService.LeerUno(pacienteId).subscribe({
    next: (response: any) => {
      const dialogRef = this.dialog.open(FormComponent, {
        autoFocus: true,
        width: '700px',
        data: {
          tipo: 'editar',
          paciente: response.datos
        }
      });

      dialogRef.afterClosed().subscribe(result => {
        console.log('Dialog result:', result);
        this.LeerTodo(); // Para refrescar la lista después de editar
      });
    },
    error: (error) => {
      console.error('Error al obtener datos:', error);
    }
  });
}
onSearchChange(event: Event) {
  const input = event.target as HTMLInputElement;
  if(input) {
    this.searchSubject.next(input.value);
  }
}




}
