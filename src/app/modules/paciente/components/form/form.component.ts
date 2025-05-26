import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PacienteHttpService } from 'src/app/services/pacientehttp.service';
import { ToastrService } from 'ngx-toastr'; // Importamos Toastr

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit {

  formGroup!: FormGroup; 

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<FormComponent>,
    private fb: FormBuilder,
    private PacienteHttpService: PacienteHttpService,
    private toastr: ToastrService
  
  ) {}

  ngOnInit(): void { 
    this.initform();
    if (this.data.tipo === 'editar' && this.data.paciente) {
      // Si es editar, rellenamos los datos en el formulario
      this.formGroup.patchValue(this.data.paciente);
    }
  }

  cancelar()  {
    this.dialogRef.close();
  }
  guardar() {
    if (this.formGroup.valid) {
      const paciente = this.formGroup.value;
      if (this.data.tipo === 'editar') {
        // Llamamos al servicio Actualizar si es para editar
        this.PacienteHttpService.Actualizar(this.data.paciente.id, paciente).subscribe({
          next: (response) => {
            this.toastr.success('Médico actualizado correctamente', 'Éxito');
            this.dialogRef.close(response);
          },
          error: (error) => {
            this.toastr.error('Error al actualizar el médico', 'Error');
          }
        });
      } else {
        // Si es para crear, llamamos al servicio Crear
        this.PacienteHttpService.Crear(paciente).subscribe({
          next: (response) => {
            this.toastr.success('Médico agregado correctamente', 'Éxito');
            this.dialogRef.close(response);
          },
          error: (error) => {
            this.toastr.error('Error al guardar el médico', 'Error');
          }
        });
      }
    }
  }

  

  initform() {

    this.formGroup = this.fb.group({
      cedula: [{value: null, disabled:false }, [Validators.required]],
      nombre: [{value: null, disabled:false }, [Validators.required]], 
      apellidopat: [{ value: null, disabled: false }, [Validators.required]],
      apellidomar: [{ value: null, disabled: false }],
      direccion: [{ value: null, disabled: false }, [Validators.required]],
      celular: [{ value: null, disabled: false }, [Validators.required]],
      correo: [{ value: null, disabled: false }, [Validators.email]],

  });


}}
