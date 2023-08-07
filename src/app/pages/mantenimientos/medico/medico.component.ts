import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { delay } from 'rxjs/operators';
import { Hospital } from 'src/app/models/hospital.model';
import { Medico } from 'src/app/models/medico.model';
import { HospitalService } from 'src/app/services/hospital.service';
import { MedicoService } from 'src/app/services/medico.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-medico',
  templateUrl: './medico.component.html',
  styleUrls: ['./medico.component.css']
})
export class MedicoComponent implements OnInit {

  public medicoForm:FormGroup;
  public hospitales:Hospital[]=[];
  public hospitalSelect:Hospital;
  public medicoSelect:Medico;

  constructor(private fb:FormBuilder,
              private hospitalService:HospitalService,
              private medicoService:MedicoService,
              private router:Router,
              private activatedRoute:ActivatedRoute) { }

  ngOnInit(): void {

    this.activatedRoute.params.subscribe(({id})=>{
      this.cargarMedico(id)

    })
    // 

    this.cargarHospitales();
    this.medicoForm=this.fb.group({
      nombre:['',Validators.required],
      hospital:['',Validators.required]
    })

    this.medicoForm.get('hospital').valueChanges
            .subscribe(hospitalId=>{
              this.hospitalSelect=this.hospitales.find(h=>h._id===hospitalId);
              
            })

  }

  cargarMedico(id:string){
    if(id==='nuevo') return;
    this.medicoService.obtenerMedicoId(id)
          .pipe(
            delay(200)
          )
          .subscribe(medico=>{
            const {nombre,hospital:{_id}} = medico
            this.medicoSelect=medico;
            this.medicoForm.setValue({nombre,hospital:_id})
            return true
          },error=>{
            this.router.navigateByUrl('/dashboard/medicos')
          })
  }

  cargarHospitales(){
    this.hospitalService.cargarHospitales()
            .subscribe((hospital:Hospital[])=>{
              this.hospitales=hospital;
            })
  }

  guardarMedico(){

    if(this.medicoSelect){
      const data={
        ...this.medicoForm.value,
        _id:this.medicoSelect._id
      }
      this.medicoService.actualizarMedico(data)
            .subscribe(({medico}:any)=>{
              Swal.fire('Medico',`Medico ${medico.nombre} actualizado correctamente`,'success')
            },({errors})=>{
              Swal.fire('Medico',`Error: ${errors.msg}`,'error')
            })
    }else{
      this.medicoService.crearMedico(this.medicoForm.value)
             .subscribe((resp:any)=>{
               console.log(resp)
               Swal.fire('Medico',`Medico ${resp.medico.nombre} fue creado con exito`,'success')
             },({error})=>{
               console.log(error)
               Swal.fire('Medico',`${error.errors.hospital.msg}`,'error')
             })
   
       this.router.navigateByUrl('/dashboard/medicos')

    }
    

  }



}
