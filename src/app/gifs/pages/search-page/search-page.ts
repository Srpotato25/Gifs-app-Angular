import { Component, inject, signal } from '@angular/core';
import { GifList } from "../../components/gif-list/gif-list";
import { GifsService } from '../../services/gifs.service';
import { Gif } from '../../interfaces/gif.interface';

@Component({
  selector: 'app-search-page',
  imports: [GifList],
  templateUrl: './search-page.html',
})
export default class SearchPage {

  gifsDogs = inject(GifsService);
  gifs = signal<Gif[]>([]);

  onSearch(query:string){
    this.gifsDogs.searchGifs(query).subscribe((resp) => {
      this.gifs.set(resp);
    });
  }
}
