import { Component } from '@angular/core';
import { environment } from '@environments/environment';
//import { environment } from '../../../../../environments/environment';
//Para hacer esto se creo un alias en tsconfig.json, para no estar poniendo ../../ etc

@Component({
  selector: 'gifs-side-menu-header',
  imports: [],
  templateUrl: './side-menu-header.html'
})
export class SideMenuHeader {
  envs = environment;
}
