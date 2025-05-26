import {
  Component, Inject, OnInit, ViewChild, ElementRef, AfterViewInit
} from '@angular/core';
import {
  FormBuilder, FormGroup, Validators, AbstractControl
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { IngresoHttpService } from 'src/app/services/ingresohttp.service';
import { ToastrService } from 'ngx-toastr';
import { PacienteHttpService } from 'src/app/services/pacientehttp.service';
import { EgresoHttpService } from 'src/app/services/egresohttp.service';
import { HttpService } from 'src/app/services/http.service';
import { MatAutocompleteTrigger, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit, AfterViewInit {
  formGroup!: FormGroup;

  pacientes: any[] = [];
  medicos: any[] = [];
  ingresos: any[] = [];
  filteredPacientes: any[] = [];

  modoEdicion = false;

  @ViewChild('autoPaciente') pacienteAutoTrigger!: MatAutocompleteTrigger;
  @ViewChild('pacienteInput') pacienteInputRef!: ElementRef;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<FormComponent>,
    private fb: FormBuilder,
    private ingresoService: IngresoHttpService,
    private toastr: ToastrService,
    private pacienteService: PacienteHttpService,
    private medicoService: HttpService,
    private egresoService: EgresoHttpService,
  ) {}

  ngOnInit(): void {
    this.modoEdicion = this.data.tipo === 'editar';
    this.initForm();
    this.cargarListas();

    this.formGroup.get('pacienteid')?.valueChanges.subscribe(value => {
      if (typeof value === 'string') {
        this.filteredPacientes = this.filtrarPacientes(value);
      }
    });
  }

  ngAfterViewInit(): void {
    if (!this.modoEdicion) {
      setTimeout(() => this.pacienteAutoTrigger?.openPanel?.(), 300);
    }
  }

  initForm(): void {
    this.formGroup = this.fb.group({
      pacienteid: [null, [Validators.required, this.validateObjectFromList(() => this.pacientes)]],
      medicoid: [{ value: null, disabled: true }, Validators.required],
      ingresoid: [{ value: null, disabled: true }, Validators.required],
      fecha: [new Date(), [Validators.required]],
      tratamiento: [null, [Validators.required]],
      monto: [null, [Validators.required]],
      numerocama: [null],
      diagnostico: [null],
      observacion: [null]
    });
  }

  cargarListas(): void {
  let pacientesListos = false;
  let medicosListos = false;
  let ingresosListos = false;

  this.pacienteService.LeerTodo(1000, 0, '').subscribe((res: any) => {
    this.pacientes = res.datos.elemento;
    pacientesListos = true;
    aplicarPatchSiListos();
  });

  this.medicoService.LeerTodo(1000, 0, '').subscribe((res: any) => {
    this.medicos = res.datos.elemento;
    medicosListos = true;
    aplicarPatchSiListos();
  });

  this.ingresoService.LeerTodo(1000, 0, '').subscribe((res: any) => {
    this.ingresos = res.datos.elemento;
    ingresosListos = true;
    aplicarPatchSiListos();
  });

  const aplicarPatchSiListos = () => {
    if (pacientesListos && medicosListos && ingresosListos) {
      // 🔥 Filtrar pacientes que tienen al menos un ingreso
      const pacientesConIngreso = new Set(this.ingresos.map(i => i.pacienteid));
      this.pacientes = this.pacientes.filter(p => pacientesConIngreso.has(p.id));
      this.filteredPacientes = [...this.pacientes];

      if (this.modoEdicion) {
        const egreso = this.data.egreso;
        const pacienteCompleto = this.pacientes.find(p => p.id === egreso.pacienteid || p.id === egreso.paciente?.id);
        const medicoCompleto = this.medicos.find(m => m.id === egreso.medicoid || m.id === egreso.medico?.id);
        const ingresoCompleto = this.ingresos.find(i => i.id === egreso.ingresoid || i.id === egreso.ingreso?.id);

        this.formGroup.patchValue({
          ...egreso,
          pacienteid: pacienteCompleto ?? null,
          medicoid: medicoCompleto ?? null,
          ingresoid: ingresoCompleto ?? null
        });
      }
    }
  };
}


  guardar(): void {
    if (this.formGroup.valid) {
      const egresoFormValue = this.formGroup.getRawValue();

      const fecha = new Date(egresoFormValue.fecha);
      const now = new Date();
      fecha.setHours(now.getHours(), now.getMinutes(), now.getSeconds(), now.getMilliseconds());

      const egreso = {
        ...egresoFormValue,
        pacienteid: egresoFormValue.pacienteid?.id ?? null,
        medicoid: egresoFormValue.medicoid?.id ?? null,
        ingresoid: egresoFormValue.ingresoid?.id ?? null,
        fecha: fecha.toISOString()
      };

      const llamada = this.modoEdicion
        ? this.egresoService.Actualizar(this.data.egreso.id, egreso)
        : this.egresoService.Crear(egreso);

      llamada.subscribe({
        next: (response) => {
          this.toastr.success(
            `Egreso ${this.modoEdicion ? 'actualizado' : 'agregado'} correctamente`,
            'Éxito'
          );
          this.dialogRef.close(response);
        },
        error: () => this.toastr.error('Error al procesar el egreso', 'Error')
      });
    }
  }

  cancelar(): void {
    this.dialogRef.close();
  }

  validateObjectFromList(getList: () => any[]) {
    return (control: AbstractControl) => {
      const value = control.value;
      if (!value || typeof value !== 'object') return { invalidOption: true };
      const exists = getList().some(x => x.id === value.id);
      return exists ? null : { invalidOption: true };
    };
  }

  filtrarPacientes(valor: any): any[] {
    const texto = typeof valor === 'string' ? valor : this.displayPaciente(valor);
    return this.pacientes.filter(p =>
      this.displayPaciente(p).toLowerCase().includes(texto.toLowerCase())
    );
  }

  displayPaciente(p: any): string {
    return p && typeof p === 'object' ? p.nombre : '';
  }

  onPacienteSelected(event: MatAutocompleteSelectedEvent): void {
    const paciente = event.option.value;
    this.formGroup.get('pacienteid')?.setValue(paciente);

    // Obtener ingreso más reciente
    const ingresosPaciente = this.ingresos
      .filter(i => i.pacienteid === paciente.id)
      .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());

    if (ingresosPaciente.length > 0) {
      const ingreso = ingresosPaciente[0];
      const medico = this.medicos.find(m => m.id === ingreso.medicoid);

      this.formGroup.get('ingresoid')?.setValue(ingreso);
      this.formGroup.get('medicoid')?.setValue(medico);
    } else {
      this.toastr.warning('Este paciente no tiene ingresos registrados.', 'Atención');
      this.formGroup.get('ingresoid')?.reset();
      this.formGroup.get('medicoid')?.reset();
    }
  }
}
