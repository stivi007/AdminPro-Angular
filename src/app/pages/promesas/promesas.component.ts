import { Component, OnInit } from '@angular/core';



@Component({
  selector: 'app-promesas',
  templateUrl: './promesas.component.html',
  styleUrls: ['./promesas.component.css']
})
export class PromesasComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {

    // const promesa=new Promise((resolve,reject)=>{
    //   if(false){
    //     resolve('hola que tal');
    //   }else{
    //     reject('Algo salio mal bro');
    //   }
    // });

    // promesa
    //   .then((mensaje)=>{
    //     console.log(mensaje);
    //   })
    //   .catch(error=>console.log(error));

    // console.log('Fin del init');

    this.getUsuarios().then(usuarios=>{
      console.log(usuarios);
    })


  }

  getUsuarios(){

    const promesa = new Promise((resolve)=>{
      fetch('https://reqres.in/api/users?page=2')
        .then(resp=>resp.json())
        .then(data=>resolve(data.data))
    });

    // fetch('https://reqres.in/api/users?page=2')
    //       .then(resp=>{
    //         resp.json().then(body=>console.log(body.data))
    //       })
    return promesa;
  }

}
