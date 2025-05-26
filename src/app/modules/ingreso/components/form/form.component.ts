import {  Component, Inject, OnInit, ViewChild, ElementRef, AfterViewInit} from '@angular/core';
import {  FormBuilder, FormGroup, Validators, AbstractControl} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { IngresoHttpService } from 'src/app/services/ingresohttp.service';
import { ToastrService } from 'ngx-toastr';
import { PacienteHttpService } from 'src/app/services/pacientehttp.service';
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
  filteredPacientes: any[] = [];
  filteredMedicos: any[] = [];

  modoEdicion = false;

  @ViewChild('autoPaciente') pacienteAutoTrigger!: MatAutocompleteTrigger;
  @ViewChild('autoMedico') medicoAutoTrigger!: MatAutocompleteTrigger;
  @ViewChild('pacienteInput') pacienteInputRef!: ElementRef;
  @ViewChild('medicoInput') medicoInputRef!: ElementRef;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<FormComponent>,
    private fb: FormBuilder,
    private IngresoHttpService: IngresoHttpService,
    private toastr: ToastrService,
    private pacienteService: PacienteHttpService,
    private medicoService: HttpService
  ) {}

  ngOnInit(): void {
    this.modoEdicion = this.data.tipo === 'editar';
    this.initForm();
    this.cargarListas();

    this.formGroup.get('pacienteid')?.valueChanges.subscribe(value => {
      if (typeof value === 'string' && !this.modoEdicion) {
        this.filteredPacientes = this.filtrarPacientes(value);
      }
    });

    this.formGroup.get('medicoid')?.valueChanges.subscribe(value => {
      if (typeof value === 'string' && !this.modoEdicion) {
        this.filteredMedicos = this.filtrarMedicos(value);
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
      medicoid: [null, [Validators.required, this.validateObjectFromList(() => this.medicos)]],
      fecha: [new Date(), [Validators.required]],
      numerosala: [null, [Validators.required]],
      numerocama: [null, [Validators.required]],
      diagnostico: [null, [Validators.required]],
      observacion: [null]
    });
  }

  cargarListas(): void {
    let pacientesListos = false;
    let medicosListos = false;

    this.pacienteService.LeerTodo(1000, 0, '').subscribe((res: any) => {
      this.pacientes = res.datos.elemento;
      this.filteredPacientes = [...this.pacientes];
      pacientesListos = true;
      aplicarPatchSiListos();
    });

    this.medicoService.LeerTodo(1000, 0, '').subscribe((res: any) => {
      this.medicos = res.datos.elemento;
      this.filteredMedicos = [...this.medicos];
      medicosListos = true;
      aplicarPatchSiListos();
    });

    const aplicarPatchSiListos = () => {
      if (pacientesListos && medicosListos && this.modoEdicion) {
        const ingreso = this.data.ingreso;

        const pacienteCompleto = this.pacientes.find(p => p.id === ingreso.pacienteid || p.id === ingreso.paciente?.id);
        const medicoCompleto = this.medicos.find(m => m.id === ingreso.medicoid || m.id === ingreso.medico?.id);

        this.formGroup.patchValue({
          ...ingreso,
          pacienteid: pacienteCompleto ?? null,
          medicoid: medicoCompleto ?? null
        });
      }
    };
  }

  guardar(): void {
    if (this.formGroup.valid) {
      const ingresoFormValue = this.formGroup.value;

      const fecha = new Date(ingresoFormValue.fecha);
      const now = new Date();
      fecha.setHours(now.getHours(), now.getMinutes(), now.getSeconds(), now.getMilliseconds());

      const ingreso = {
        ...ingresoFormValue,
        pacienteid: ingresoFormValue.pacienteid?.id ?? null,
        medicoid: ingresoFormValue.medicoid?.id ?? null,
        fecha: fecha.toISOString()
      };

      const llamada = this.modoEdicion
        ? this.IngresoHttpService.Actualizar(this.data.ingreso.id, ingreso)
        : this.IngresoHttpService.Crear(ingreso);

      llamada.subscribe({
        next: (response) => {
          this.toastr.success(
            `Ingreso ${this.modoEdicion ? 'actualizado' : 'agregado'} correctamente`,
            'Éxito'
          );
          this.dialogRef.close(response);
        },
        error: () => this.toastr.error('Error al procesar el ingreso', 'Error')
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

  filtrarMedicos(valor: any): any[] {
    const texto = typeof valor === 'string' ? valor : this.displayMedico(valor);
    return this.medicos.filter(m =>
      this.displayMedico(m).toLowerCase().includes(texto.toLowerCase())
    );
  }

  displayPaciente(p: any): string {
    return p && typeof p === 'object' ? p.nombre : '';
  }

  displayMedico(m: any): string {
    return m && typeof m === 'object' ? m.nombre : '';
  }

  onPacienteSelected(event: MatAutocompleteSelectedEvent): void {
    const paciente = event.option.value;
    this.formGroup.get('pacienteid')?.setValue(paciente);
  }

  onMedicoSelected(event: MatAutocompleteSelectedEvent): void {
    const medico = event.option.value;
    this.formGroup.get('medicoid')?.setValue(medico);
  }
}
