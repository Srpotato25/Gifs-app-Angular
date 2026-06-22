import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SideMenuHeader } from './side-menu-header/side-menu-header';
import { SideMenuOptions } from './side-menu-options/side-menu-options';

@Component({
  selector: 'gifs-side-menu',
  imports: [SideMenuHeader,SideMenuOptions],
  templateUrl: './gifs-side-menu.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GifsSideMenu {}
