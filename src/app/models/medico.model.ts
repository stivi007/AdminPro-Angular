import { Hospital } from "./hospital.model";

interface _MedicoUsuario{
    nombre:string;
    _id:string;
    img:string
}



export class Medico{
    constructor(
        public nombre:string,
        public _id?:string,
        public img?:string,
        public usuario?:_MedicoUsuario,
        public hospital?:Hospital
    ){}
}