import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, tap } from "rxjs/operators";
import { RegisterForm } from '../components/interfaces/register-form.interface';
import { environment } from 'src/environments/environment';
import { LoginForm } from '../components/interfaces/login-form.interface';
import { of } from 'rxjs';
import { Usuario } from '../models/usuario.model';

const base_url = environment.base_url

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  public usuario:Usuario;

  constructor(private http:HttpClient) { }

  get token():string{
    return localStorage.getItem('token') || '';
  }

  get uid():string{
    return this.usuario.uid || '';
  }

  logout(){
    localStorage.removeItem('token')
  }

  validarToken(){
    // const token = localStorage.getItem('token') || '';

    return this.http.get(`${base_url}/login/renew`,{
      headers:{
        'x-token':this.token
      }
    }).pipe(
      map((resp:any)=>{
        const {nombre,email,password,google,role,img='',uid} = resp.usuario
        this.usuario=new Usuario(nombre,email,'',google,role,img,uid)
        localStorage.setItem('token',resp.token);
        return true;
      }),
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

  actualizarUsuario( data: { email: string, nombre: string, role:string } ) {

    data = {
      ...data,
      role: this.usuario.role || 'USER_ROLE'
    };

    return this.http.put(`${ base_url }/usuarios/${ this.uid }`, data, {
      headers: {
        'x-token': this.token
      }
    });

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
