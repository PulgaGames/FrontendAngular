import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { IngresoHttpService } from 'src/app/services/ingresohttp.service';
import { FormComponent } from '../form/form.component';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { HttpService } from 'src/app/services/http.service';
import { PacienteHttpService } from 'src/app/services/pacientehttp.service';
import { EgresoHttpService } from 'src/app/services/egresohttp.service';



@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {

  displayedColumns: string[] = ['pacienteid','medicoid','fechaingreso','fechaegreso', 'tratamiento', 'monto','acciones'];
  dataSource = new MatTableDataSource<any>([]);
  searchSubject: Subject<string> = new Subject<string>();


  cantidadTotal= 0;
  cantidadPorPagina= 10;
  numeroPagina= 0;
  opcionesDePaginacion: number[]= [1, 5, 10, 25, 100];
  pacientes: any[] = [];
  medicos: any[] = [];
  ingresos: any[] = [];


  textoBusqueda= '';
  

  constructor(
    private EgresoHttpService: EgresoHttpService,
    private pacienteService: PacienteHttpService,
    private ingresoService: IngresoHttpService,
    private medicoService: HttpService,
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

    this.pacienteService.LeerTodo(1000, 0, '').subscribe((res: any) => {
    this.pacientes = res.datos.elemento;
});

    this.medicoService.LeerTodo(1000, 0, '').subscribe((res: any) => {
    this.medicos = res.datos.elemento;
});

    this.ingresoService.LeerTodo(1000, 0, '').subscribe((res: any) => {
    this.ingresos = res.datos.elemento;
});

  }

  LeerTodo(){
    this.EgresoHttpService.LeerTodo(this.cantidadPorPagina, this.numeroPagina, this.textoBusqueda)
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

  eliminar(egresoid: number, event: MouseEvent) {
  event.stopPropagation(); // 🔥 evita que se dispare el click de la fila

  const confirmacion = confirm('¿Está seguro/a que desea eliminar el elemento?');
  if (confirmacion) {
    const ids = [egresoid];
    this.EgresoHttpService.Eliminar(ids).subscribe({
      next: () => {
        this.Toastr.success('Eliminado correctamente', 'Éxito');
        this.LeerTodo(); // recarga datos
      },
      error: () => {
        this.Toastr.error('Error al eliminar el egreso', 'Error');
      }
    });
  }
}

  crearEgreso() {
    
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
actualizarEgreso(egresoid: number) {
  this.EgresoHttpService.LeerUno(egresoid).subscribe({
    next: (response: any) => {
      const egreso = response.datos;

      const dialogRef = this.dialog.open(FormComponent, {
        autoFocus: true,
        width: '700px',
        data: {
          tipo: 'editar',
          egreso: {
            ...egreso,
            pacienteid: egreso.paciente, // ya viene desde el backend
            medicoid: egreso.medico,
            ingresoid: egreso.ingreso      // ya viene desde el backend
          }
        }
      });

      dialogRef.afterClosed().subscribe(result => {
        this.LeerTodo(); // Refrescar la tabla
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

getNombrePaciente(egreso: any): string {
  return egreso?.ingreso?.paciente?.nombre ?? '—';
}


getNombreMedico(medico: any): string {
  if (!medico) return '—';
  return typeof medico === 'object' ? medico.nombre : this.medicos.find(m => m.id === medico)?.nombre ?? medico.toString();
}



}
