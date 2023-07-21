import { Component, OnInit } from '@angular/core';
import {DOCUMENT} from '@angular/common';
import { SettingsService } from 'src/app/services/settings.service';

@Component({
  selector: 'app-account-settings',
  templateUrl: './account-settings.component.html',
  styles: [
  ]
})
export class AccountSettingsComponent implements OnInit {

  
  constructor(private settingSservice:SettingsService) { }

  ngOnInit(): void {
    this.settingSservice.checkCurrentTheme();
  }

  changeTheme(theme:string){
    
    this.settingSservice.changeTheme(theme);

  }

  

}
