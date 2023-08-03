import { Component, OnDestroy, OnInit } from '@angular/core';
import { Usuario } from 'src/app/models/usuario.model';
import { BusquedasService } from 'src/app/services/busquedas.service';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';
import { delay } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit, OnDestroy {
  public total:number = 0;
  public usuarios:Usuario[]=[];
  public usuariosTemp:Usuario[]=[];
  public imgSubs:Subscription;
  public desde:number = 0;
  public cargando:boolean=true;

  constructor(private usuarioService : UsuarioService,
              private busquedaService : BusquedasService,
              private modalImagenService:ModalImagenService) { }
  ngOnDestroy(): void {
    this.imgSubs.unsubscribe();
  }

  ngOnInit(): void {
   this.cargarUsuarios();
   this.imgSubs=this.modalImagenService.nuevaImagen
          .pipe(
            delay(500)
          )
          .subscribe(img=>{this.cargarUsuarios()})
  }

  cargarUsuarios(){
    this.cargando=true;
    this.usuarioService.cargarUsuarios(this.desde)
      .subscribe(({total,usuarios})=>{
        this.total=total;
        this.usuarios=usuarios;
        console.log(usuarios)
        this.usuariosTemp=usuarios;
        this.cargando=false;
      });
  }

  cambiarPagina(valor:number){
    this.desde+=valor;
    if(this.desde < 0){
      this.desde=0;
    }else if(this.desde > this.total){
      this.desde -= valor;
    }
    this.cargarUsuarios();
  }
  buscar(termino:string){
    if(termino.length === 0){
      return this.usuarios=this.usuariosTemp;
    }
    this.busquedaService.busqueda('usuarios',termino)
              .subscribe((resp:any)=>{
                this.usuarios=resp;
              });
    return true;
  }

  eliminarUsuario(usuario:Usuario){
    if(usuario.uid === this.usuarioService.uid){
      return Swal.fire('Error','No puede borrarse a si mismo','error')
    }
    
    Swal.fire({
      title: '¿Eliminar usuario?',
      text: `¿Esta seguro de eliminar a: ${usuario.nombre}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Eliminar'
    }).then((result) => {
      if (result.value) {
        this.usuarioService.eliminarUsuario(usuario)
                  .subscribe(resp=>{
                    console.log(resp)
                    Swal.fire(
                      'Deleted!',
                      `El usuario ${usuario.nombre} fue eliminado correctamente`,
                      'success'
                    )
                    this.cargarUsuarios()
                  })
      }
    })
    return true;
  }

  cambiarRol(usuario:Usuario){
    console.log(usuario)
    this.usuarioService.actualizarRolUsuario(usuario)
            .subscribe(resp=>{
              console.log(resp)
            })
  }

  abrirModal(usuario:Usuario){
    console.log(usuario)
    this.modalImagenService.abrirModal('usuarios',usuario.uid,usuario.img);
  }

}
