import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {

  modulos = [
    { nombre: 'Ingreso', icono: 'event_available', ruta: '/ingreso/index' },
    { nombre: 'Egreso', icono: 'event_busy', ruta: '/egreso/index' },
    { nombre: 'Paciente', icono: 'co_present', ruta: '/paciente/index' },
    { nombre: 'Medico', icono: 'badge', ruta: '/medico/index' }
  ];

  constructor() { }

  ngOnInit(): void {
    console.log('IndexComponent loaded');
  }

  

}
