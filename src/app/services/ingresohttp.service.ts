import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})

export class IngresoHttpService {

    constructor(private http: HttpClient) { }
    

    LeerTodo(cantidad: number, pagina: number, texto: string) {
        let parametros = new HttpParams();
        parametros = parametros.append('cantidad', cantidad);
        parametros = parametros.append('pagina', pagina);
        parametros = parametros.append('texto', texto);
        return this.http.get('http://localhost:65300/api/ingreso', { params: parametros });
    }
    Eliminar(ids: number[]) {
        const option = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json'
          }),
          body: ids
        };
      
        return this.http.delete('http://localhost:65300/api/ingreso', option);
      }

    Crear(ingreso: any): Observable<any> {
        return this.http.post('http://localhost:65300/api/ingreso', ingreso);
    }
      

    LeerUno(id: number): Observable<any> {
      return this.http.get(`http://localhost:65300/api/ingreso/${id}`);
    }
  
    Actualizar(id: number, ingreso: any): Observable<any> {
      return this.http.put(`http://localhost:65300/api/ingreso/${id}`, ingreso);
    }
}