import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls:['./register.component.css']
})
export class RegisterComponent {

  public formSubmitted = false;
  public registerForm = this.fb.group({
    nombre:['',Validators.required],
    email:['',[Validators.required,Validators.email]],
    password:['',Validators.required]
  });

  constructor(private fb:FormBuilder,
              private usuarioService:UsuarioService,
              private router : Router) { }

  crearUsuario(){
    this.formSubmitted=true;
    console.log('valores:',this.registerForm.value)
    if(this.registerForm.invalid){
      return
    }
    this.usuarioService.crearUsuario(this.registerForm.value)
                            .subscribe(resp=>{
                              console.log('usuario creado')
                              console.log(resp)
                              this.router.navigateByUrl('/dashboard')
                            },({error})=>{
                              Swal.fire('Error',error.msg,'error');
                            });
  }

  campoNoValido(campo:string):boolean{
    if(this.registerForm.get(campo)?.invalid && this.formSubmitted){
      return true;
    }else{
      return false;
    }
  }

  // aceptaTerminos(){
  //   return !this.registerForm.get('terminos')?.value && this.formSubmitted;
  // }
  // passwordInValid(){
  //   const pass1= this.registerForm.get('password')?.value;
  //   const pass2= this.registerForm.get('password2')?.value;
  //   if((pass1!==pass2) && this.formSubmitted){
  //     return true;
  //   }else{
  //     return false;
  //   }
  // }

  // passwordsIguales(pass1Name:string,pass2Name:string){
  //   return (formGrup:FormGroup)=>{
  //     const pass1Control = formGrup.get(pass1Name);
  //     const pass2Control = formGrup.get(pass2Name);
  //     if(pass1Control?.value === pass2Control?.value){
  //       pass2Control?.setErrors(null)
  //     }else{
  //       pass2Control?.setErrors({noEsIgual:true})
  //     }
  //   }
  // }

}
