import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Hospital } from 'src/app/models/hospital.model';
import { BusquedasService } from 'src/app/services/busquedas.service';
import { HospitalService } from 'src/app/services/hospital.service';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-hospitales',
  templateUrl: './hospitales.component.html',
  styleUrls: ['./hospitales.component.css']
})
export class HospitalesComponent implements OnInit , OnDestroy {

  public hospitales:Hospital[]=[];
  public hospitalesTemp:Hospital[]=[];
  public cargando:boolean=true;
  public imgSubs:Subscription;

  constructor(private hospitalService:HospitalService,
              private modalImagenService:ModalImagenService,
              private busquedaService:BusquedasService) { }
  ngOnDestroy(): void {
    this.imgSubs.unsubscribe();
  }

  ngOnInit(): void {
    this.cargarHospitales();
    this.imgSubs=this.modalImagenService.nuevaImagen
          .pipe(
            delay(500)
          )
          .subscribe(img=>{this.cargarHospitales()})
  }

  cargarHospitales(){
    this.cargando=false;
    this.hospitalService.cargarHospitales().subscribe(hospitales=>{
      this.hospitales=hospitales;
      console.log(this.hospitales)
    })
  }

  guardarCambios(hospital:Hospital){
    this.hospitalService.actualizarHospital(hospital._id,hospital.nombre)
          .subscribe(resp=>{
            Swal.fire('Actualizado',`El hospital se actualizo correctamente`,'success')
          })
  }

  eliminarHospital(hospital:Hospital){
    Swal.fire({
      title:'¿Eliminar hospital?',
      text:`¿Esta seguro que quiere eliminar el ${hospital.nombre}?`,
      icon:'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Eliminar'
    }).then((result)=>{
      if(result.value){
        this.hospitalService.eliminarHospital(hospital._id)
              .subscribe(resp=>{
                Swal.fire(
                  'Deleted!',
                  `El hospital ${hospital.nombre} fue eliminado correctamente`,
                  'success'
                )
                this.cargarHospitales();
              })
      }
    })
  }

  async crearHospital(){
    const valor = await Swal.fire<string>({
      input: 'text',
      inputLabel: 'Nombre del hospital',
      inputPlaceholder: 'Introdusca el nombre',
      showCancelButton: true,
    })
    if(valor.value.trim().length>0){
      this.hospitalService.crearHospital(valor.value)
            .subscribe(resp=>{
              Swal.fire('Guardado',`El hospital ${valor.value} fue creado exitosamente`,'success')
              this.cargarHospitales();
            })
    }else{
      Swal.fire('Error','Tiene que llenar el campo','error')
      return;
    }
    
  }

  abrirModal(hospital:Hospital){
    this.modalImagenService.abrirModal('hospitales',hospital._id,hospital.img)
  }

  buscar(termino:string){
    if(termino.length === 0){
      return this.hospitales=this.hospitalesTemp;
    }
    this.busquedaService.busqueda('hospitales',termino)
              .subscribe((resp:any)=>{
                console.log(resp)
                this.hospitales=resp;
              });
    return true;
  }

}
