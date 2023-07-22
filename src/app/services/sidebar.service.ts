import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {

  menu:any[]=[
    {
      title:'Dashboard',
      icon:'mdi mdi-gauge',
      submenu:[
        {
          titulo:'Main',
          url:'/dashboard'
        },
        {
          titulo:'Progress',
          url:'/dashboard/progress'
        },
        {
          titulo:'Grafica',
          url:'/dashboard/grafica'
        },
        {
          titulo:'Promesas',
          url:'/dashboard/promesas'
        },
        {
          titulo:'Rxjs',
          url:'/dashboard/rxjs'
        }
      ]
    }
  ];

  constructor() { }
}
