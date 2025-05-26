import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";


@Injectable({
    providedIn: 'root'
})

export class PacienteHttpService {

    constructor(private http: HttpClient) { }
    

    LeerTodo(cantidad: number, pagina: number, texto: string) {
        let parametros = new HttpParams();
        parametros = parametros.append('cantidad', cantidad);
        parametros = parametros.append('pagina', pagina);
        parametros = parametros.append('texto', texto);
        return this.http.get('http://localhost:65300/api/paciente', { params: parametros });
    }
    Eliminar(ids: number[]) {
        const option = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json'
          }),
          body: ids
        };
      
        return this.http.delete('http://localhost:65300/api/paciente', option);
      }

    Crear(paciente: any): Observable<any> {
        return this.http.post('http://localhost:65300/api/paciente', paciente);
    }
      

    LeerUno(id: number): Observable<any> {
      return this.http.get(`http://localhost:65300/api/paciente/${id}`);
    }
  
    Actualizar(id: number, paciente: any): Observable<any> {
      return this.http.put(`http://localhost:65300/api/paciente/${id}`, paciente);
    }
}