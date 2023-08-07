import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Medico } from 'src/app/models/medico.model';
import { BusquedasService } from 'src/app/services/busquedas.service';
import { MedicoService } from 'src/app/services/medico.service';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-medicos',
  templateUrl: './medicos.component.html',
  styleUrls: ['./medicos.component.css']
})
export class MedicosComponent implements OnInit, OnDestroy {

  public cargando:boolean=true;
  public medicos:Medico[]=[];
  public medicosTemp:Medico[]=[];
  public imgSubs:Subscription;

  constructor(private medicoService:MedicoService,
              private busquedaService:BusquedasService,
              private modalImagenService:ModalImagenService) { }
  ngOnDestroy(): void {
    this.imgSubs.unsubscribe();
  }

  ngOnInit(): void {
    this.cargarMedicos();
    this.imgSubs=this.modalImagenService.nuevaImagen
          .pipe(
            delay(500)
          )
          .subscribe(img=>{this.cargarMedicos()})
  }

  cargarMedicos(){
    this.cargando=false;
    this.medicoService.cargarMedicos().subscribe(resp=>{
      this.medicos=resp;
      this.medicosTemp=resp;
    })
  }

  crearMedico(){

  }


  buscar(termino:string){
    if(termino.length === 0){
      return this.medicos=this.medicosTemp;
    }
    this.busquedaService.busqueda('medicos',termino)
              .subscribe((resp:any)=>{
                console.log(resp)
                this.medicos=resp;
              });
    return true;
  }

  eliminarMedico(medico:Medico){
    Swal.fire({
      title:'¿Eliminar medico?',
      text:`¿Esta seguro que quiere eliminar a ${medico.nombre}?`,
      icon:'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Eliminar'
    }).then((result)=>{
      if(result.value){
        this.medicoService.eliminarMedico(medico._id)
              .subscribe(resp=>{
                Swal.fire(
                  'Deleted!',
                  `El hospital ${medico.nombre} fue eliminado correctamente`,
                  'success'
                )
                this.cargarMedicos();
              })
      }
    })
  }

  abrirModal(medico:Medico){
    this.modalImagenService.abrirModal('medicos',medico._id,medico.img)
  }

}
