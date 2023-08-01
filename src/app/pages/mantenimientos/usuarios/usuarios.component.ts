import { Component, OnInit } from '@angular/core';
import { Usuario } from 'src/app/models/usuario.model';
import { BusquedasService } from 'src/app/services/busquedas.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {
  public total:number = 0;
  public usuarios:Usuario[]=[];
  public usuariosTemp:Usuario[]=[];
  public desde:number = 0;
  public cargando:boolean=true;

  constructor(private usuarioService : UsuarioService,
              private busquedaService : BusquedasService) { }

  ngOnInit(): void {
   this.cargarUsuarios();
   
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

}
