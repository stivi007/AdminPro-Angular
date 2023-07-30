import { Component, OnInit, enableProdMode } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Usuario } from 'src/app/models/usuario.model';
import { FileuploadService } from 'src/app/services/fileupload.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {

  public perfilForm : FormGroup;
  public usuario:Usuario;
  public imagenSubir:File;
  public imgTemp : any=null;

  constructor(private fs:FormBuilder,
              private usuarioService : UsuarioService,
              private fileUploadService : FileuploadService) {
    this.usuario=usuarioService.usuario;
  }

  ngOnInit(): void {

    this.perfilForm=this.fs.group({
      nombre:[this.usuario.nombre,Validators.required],
      email:[this.usuario.email,[Validators.required,Validators.email]]
    });
  }

  actualizarPerfil(){
    console.log(this.perfilForm.value);
    this.usuarioService.actualizarUsuario(this.perfilForm.value)
                          .subscribe(resp=>{
                             const {nombre,email} = this.perfilForm.value;
                             this.usuario.nombre=nombre;
                             this.usuario.email=email;
                             Swal.fire('Exito','Los cambios fueron guardados','success');
                          },({error})=>{
                            Swal.fire('Error',error.msg,'error');
                          })
  }

  cambiarImagen(file:File){
    this.imagenSubir = file;
    if(!file){
      return this.imgTemp = null;
    }
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = ()=>{
      this.imgTemp=reader.result;
    }
  }

  subirImagen(){
    this.fileUploadService.actualizarFoto(this.imagenSubir,'usuarios',this.usuario.uid)
    .then(img=>{
      this.usuario.img=img
      Swal.fire('Imagen guardada','La imagen se guardo correctamente','success')
    }).catch((error)=>{
      Swal.fire('Error','No se pudo cargar la imagen','error');
    })
    
  }

}
