import { Injectable } from '@angular/core';
import { retry } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

const base_url=environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class FileuploadService {

  constructor() {}

  async actualizarFoto(archivo:File,tipo:'usuarios'|'medicos'|'hospitales',id:string){
    try {
      const url = `${base_url}/uploads/${tipo}/${id}`;
      const formData = new FormData();
      formData.append('imagen',archivo);
      const resp = await fetch(url,{
        method:'PUT',
        headers:{
          'x-token':localStorage.getItem('token') || ''
        },
        body:formData
      });

      const data = await resp.json()
      console.log(data)
      if(data.ok){
        return data.nombreAarchivo

      }else{
        return false;
      }

    } catch (error) {
      console.log(error)
      return false
    }
  }


}
