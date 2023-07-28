import { Component,AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';

declare const google:any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements AfterViewInit {

  @ViewChild('googleBtn') googleBtn!:ElementRef;

  public formSubmitted = false;
  public loginForm = this.fb.group({
    email:[localStorage.getItem('email')||'',[Validators.required,Validators.email]],
    password:['',Validators.required],
    remember:[false]
  });

  constructor(private router:Router,
              private fb:FormBuilder,
              private usuarioService:UsuarioService) { }

  ngAfterViewInit(): void {
    this.googleInit();
  }
  googleInit(){

    google.accounts.id.initialize({
      client_id: "153513863406-q8nf3f9jn2u7gc11ufom91380tu3rdhm.apps.googleusercontent.com",
      callback: (response:any)=>this.handleCredentialResponse(response)
    });
    google.accounts.id.renderButton(
      this.googleBtn.nativeElement,
      // document.getElementById("buttonDiv"),
      { theme: "outline", size: "large" }  // customization attributes
    );

  }

  handleCredentialResponse(response:any){
    // console.log("Encoded JWT ID token: " + response.credential);
    this.usuarioService.loginGoogle(response.credential)
      .subscribe(resp=>{
        this.router.navigateByUrl('/dashboard')
      });
  }

  login(){
    console.log(this.loginForm.value)

    this.usuarioService.login(this.loginForm.value)
                          .subscribe(resp=>{
                            if(this.loginForm.get('remember')?.value){
                              localStorage.setItem('email',this.loginForm.get('email')?.value)
                            }else{
                              localStorage.removeItem('email')
                            }
                            this.router.navigateByUrl('/dashboard')
                          },({error})=>{
                            console.log(error.msg)
                            Swal.fire('Error',error.msg,'error')
                          })
    // console.log('submit hecho')
  }

}
