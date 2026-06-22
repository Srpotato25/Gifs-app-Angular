import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';
import { GifsService } from '../../services/gifs.service';
import { GifList } from "../../components/gif-list/gif-list";

@Component({
  selector: 'gif-history',
  imports: [GifList],
  templateUrl: './gif-history.html'
})
export default class GifHistory {

  gifsService = inject(GifsService);

  query = toSignal(
    inject(ActivatedRoute).params.pipe(
      map( params => params['query'])
    )
  );

  gifsByKey = computed(()=> {
    return this.gifsService.getHistoryGifs(this.query());
  });
}
