import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})

export class EgresoHttpService {

    constructor(private http: HttpClient) { }
    

    LeerTodo(cantidad: number, pagina: number, texto: string) {
        let parametros = new HttpParams();
        parametros = parametros.append('cantidad', cantidad);
        parametros = parametros.append('pagina', pagina);
        parametros = parametros.append('texto', texto);
        return this.http.get('http://localhost:65300/api/egreso', { params: parametros });
    }
    Eliminar(ids: number[]) {
        const option = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json'
          }),
          body: ids
        };
      
        return this.http.delete('http://localhost:65300/api/egreso', option);
      }

    Crear(egreso: any): Observable<any> {
        return this.http.post('http://localhost:65300/api/egreso', egreso);
    }
      

    LeerUno(id: number): Observable<any> {
      return this.http.get(`http://localhost:65300/api/egreso/${id}`);
    }
  
    Actualizar(id: number, egreso: any): Observable<any> {
      return this.http.put(`http://localhost:65300/api/egreso/${id}`, egreso);
    }
}