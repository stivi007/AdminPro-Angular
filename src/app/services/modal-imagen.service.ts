import { EventEmitter, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

const base_url=environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class ModalImagenService {

  private _ocultarModal:boolean=true;
  public tipo:'usuarios'|'medicos'|'hospitales';
  public id:string;
  public img:string;

  public nuevaImagen:EventEmitter<string> = new EventEmitter<string>()

  get ocultar(){
    return this._ocultarModal;
  }

  constructor() { }

  abrirModal(
             tipo:'usuarios'|'medicos'|'hospitales',
             id:string,
             img:string='no-img'
            ){
    this._ocultarModal=false;
    this.tipo=tipo;
    this.id=id;

    if(img.includes('https')){
      this.img=img;
    }else{
      this.img=`${base_url}/uploads/${tipo}/${img}`;
    }
    // this.img=img;
    //http://localhost:3005/api/uploads/usuarios/64c1ac7fbff1bbb55d3b222c
    return true;
  }
  cerraModal(){
    this._ocultarModal=true;
  }



}
