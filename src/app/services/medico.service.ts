import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Medico } from '../models/medico.model';
import { Hospital } from '../models/hospital.model';

const base_url=environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class MedicoService {

  constructor(private http:HttpClient) {}

  get token():string{
    return localStorage.getItem('token') || '';
  }

  get headers(){
    return {
      headers: {
        'x-token': this.token
      }
    }
  }

  cargarMedicos(){
    return this.http.get(`${base_url}/medicos`,this.headers)
      .pipe(
        map((resp:{ok:boolean,medicos:Medico[]})=>resp.medicos)
      )
  }

  obtenerMedicoId(id:string){
    return this.http.get(`${base_url}/medicos/${id}`,this.headers)
      .pipe(
        map((resp:{ok:boolean,medico:Medico})=>resp.medico)
      )
  }

  crearMedico(medico:{nombre:string,hospital:string}){
    return this.http.post(`${base_url}/medicos`,medico,this.headers)
  }

  actualizarMedico(medico:Medico){
    return this.http.put(`${base_url}/medicos/${medico._id}`,medico,this.headers)
  }

  eliminarMedico(_id:string){
    return this.http.delete(`${base_url}/medicos/${_id}`,this.headers)
  }

}
