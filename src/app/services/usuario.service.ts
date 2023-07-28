import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, tap } from "rxjs/operators";
import { RegisterForm } from '../components/interfaces/register-form.interface';
import { environment } from 'src/environments/environment';
import { LoginForm } from '../components/interfaces/login-form.interface';
import { of } from 'rxjs';

const base_url = environment.base_url

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor(private http:HttpClient) { }

  logout(){
    localStorage.removeItem('token')
  }

  validarToken(){
    const token = localStorage.getItem('token') || '';

    return this.http.get(`${base_url}/login/renew`,{
      headers:{
        'x-token':token
      }
    }).pipe(
      tap((resp:any)=>{
        localStorage.setItem('token',resp.token);
      }),
      map(resp=> true),
      catchError(error=> of(false))
    )

  }

  crearUsuario(formData:RegisterForm){
    return this.http.post(`${base_url}/usuarios`,formData)
                .pipe(
                  tap((resp:any)=>{
                    localStorage.setItem('token',resp.token)
                  })
                )
  }

  login(formData:LoginForm){
    return this.http.post(`${base_url}/login`,formData)
                .pipe(
                  tap((resp:any)=>{
                    localStorage.setItem('token',resp.token)
                  })
                )
  }

  loginGoogle(token:string){
    return this.http.post(`${base_url}/login/google`,{token})
                  .pipe(
                    tap((resp:any)=>{
                      // console.log(resp)
                      localStorage.setItem('token',resp.token)
                    })
                  )
  }

}
