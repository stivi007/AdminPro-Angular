import { Component, OnInit } from '@angular/core';
import { SettingsService } from '../services/settings.service';

declare function customInitFunctopns():void;

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styles: [
  ]
})
export class PagesComponent implements OnInit {
  public linkTheme=document.querySelector('#theme');
  constructor(private settingService:SettingsService) { }

  ngOnInit(): void {
    
    customInitFunctopns();
    

  }

}
