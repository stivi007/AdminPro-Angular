import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, delay, map, tap } from "rxjs/operators";
import { RegisterForm } from '../components/interfaces/register-form.interface';
import { environment } from 'src/environments/environment';
import { LoginForm } from '../components/interfaces/login-form.interface';
import { of } from 'rxjs';
import { Usuario } from '../models/usuario.model';
import { CargarUsuario } from '../components/interfaces/cargar.usuario.interface';
import Swal from 'sweetalert2';

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

  get headers(){
    return {
      headers: {
        'x-token': this.token
      }
    }
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
        this.usuario = new Usuario(nombre,email,'',google,role,img,uid)
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

  actualizarUsuario( data: { email: string, nombre: string, rol:string } ) {

    data = {
      ...data,
      rol: this.usuario.rol
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

  cargarUsuarios(desde :number = 0){
    return this.http.get<CargarUsuario>(`${base_url}/usuarios?desde=${desde}`,this.headers)
                      .pipe(
                        // delay(5000),
                        map(resp=>{
                          const usuarios = resp.usuarios.map(user=> new Usuario(user.nombre,user.email,'',user.google,user.rol,user.img,user.uid))
                          
                          return {
                            total:resp.total,
                            usuarios
                          }
                          
                        })
                      )
  }

  eliminarUsuario(usuario:Usuario){
    return this.http.delete(`${base_url}/usuarios/${usuario.uid}`,this.headers)
  }

  actualizarRolUsuario( usuario: Usuario ) {
    
    return this.http.put(`${ base_url }/usuarios/${ usuario.uid }`, usuario,this.headers);

  }

}
