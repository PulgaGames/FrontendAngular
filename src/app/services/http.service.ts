import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})

export class HttpService {

    constructor(private http: HttpClient) { }
    

    LeerTodo(cantidad: number, pagina: number, texto: string) {
        let parametros = new HttpParams();
        parametros = parametros.append('cantidad', cantidad);
        parametros = parametros.append('pagina', pagina);
        parametros = parametros.append('texto', texto);
        return this.http.get('http://localhost:65300/api/medico', { params: parametros });
    }
    Eliminar(ids: number[]) {
        const option = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json'
          }),
          body: ids
        };
      
        return this.http.delete('http://localhost:65300/api/medico', option);
      }

    Crear(medico: any): Observable<any> {
        return this.http.post('http://localhost:65300/api/medico', medico);
    }
      

    LeerUno(id: number): Observable<any> {
      return this.http.get(`http://localhost:65300/api/medico/${id}`);
    }
  
    Actualizar(id: number, medico: any): Observable<any> {
      return this.http.put(`http://localhost:65300/api/medico/${id}`, medico);
    }
}