import { Component, OnDestroy } from '@angular/core';
import { Observable, Subscription, interval } from 'rxjs';
import { retry, take, map, filter } from 'rxjs/operators';


@Component({
  selector: 'app-rxjs',
  templateUrl: './rxjs.component.html',
  styleUrls: ['./rxjs.component.css']
})
export class RxjsComponent implements OnDestroy {

  public intervalSubs:Subscription;


  constructor() {
    // this.retornaObservable().pipe(
    //   retry(1)
    // ).subscribe(
    //     (valor)=>console.log('suscripcion',valor),
    //     (error)=>console.warn(error),
    //     ()=>console.log('Se completo el observer')
    // );
    
    this.intervalSubs=this.retornaIntervalo().subscribe(console.log)
    
    


  }
  ngOnDestroy(): void {
    this.intervalSubs.unsubscribe();
  }

  retornaIntervalo(){
    const interval$ = interval(1000)
                        .pipe(
                          take(10),
                          map(valor=>{
                            return valor +1
                          }),
                          filter(valor=>(valor%2 ===0?true:false))
                        )
    return interval$;
  }

  retornaObservable(){
    let i  = -1;
    const obs$ = new Observable<number>( observer=>{
      const intervalo=setInterval(()=>{
        i++;
        observer.next(i);
        if(i===4){
          clearInterval(intervalo);
          observer.complete();
        }
        if(i===2){
          observer.error('Hijole un error');
        }
      },1000)
    });
    return obs$;
  }

}
