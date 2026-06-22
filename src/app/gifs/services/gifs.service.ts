import { HttpClient } from '@angular/common/http';
import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { environment } from '@environments/environment';
import type { GiphyResponse } from '../interfaces/giphy.interface';
import { Gif } from '../interfaces/gif.interface';
import { GifMapper } from '../mapper/gif.mapper';
import { map, tap } from 'rxjs';


const GIF_KEY = 'gifs'; //es menos propenso a errores si se crea afuera

const loadFromLocalStorage = () => {

  const gifsFromLocalStorage = localStorage.getItem(GIF_KEY) ?? '{}';

  const gifs = JSON.parse(gifsFromLocalStorage);

  return gifs;

};

@Injectable({
  providedIn: 'root',
})
export class GifsService {

  private http = inject(HttpClient);

  trendingGifs = signal<Gif[]>([]);
  trendngGifSLoading = signal(true);

  searchHistory = signal<Record<string,Gif[]>>(loadFromLocalStorage());
  searchHistoryKeys = computed(()=> Object.keys(this.searchHistory())); //buscar esto

  constructor() {
    this.loadTrendingGifs();
  }

  loadTrendingGifs() {
    this.http.get<GiphyResponse>(`${ environment.giphyUrl}/gifs/trending`, {
      params: {
        api_key: environment.giphyApiKey,
        limit: 20,
      },
    }).subscribe ( (resp) => {
      const gifs = GifMapper.mapGiphyItemsToGifArray(resp.data);
      this.trendingGifs.set(gifs);
      this.trendngGifSLoading.set(false);
      console.log({gifs});
    });
  }

  searchGifs(query: string){
    return this.http
    .get<GiphyResponse>(`${ environment.giphyUrl}/gifs/search`, {
      params: {
        api_key: environment.giphyApiKey,
        limit: 20,
        q: query,
      },
    }).pipe(
      //tap( resp => console.log({tap: resp})) tap permite hacer un efecto secundario
      map(({data}) => data ),
      map((items) => GifMapper.mapGiphyItemsToGifArray(items)),

      //To do: history
      tap( items => {
        this.searchHistory.update( history => ({
          ...history,
          [query.toLowerCase()]: items,
        }));
      })
    );

    // .subscribe ( (resp) => {
    //   const gifs = GifMapper.mapGiphyItemsToGifArray(resp.data);

    //   console.log({search: gifs});
    // });
  }

  getHistoryGifs( query: string ) {
    return this.searchHistory()[query] ?? [];
  }

  saveGifsToLocalStorage = effect(() => {
    const historyString = JSON.stringify(this.searchHistory());
    localStorage.setItem(GIF_KEY, historyString );
  });
}

// const loadFromLocalStorage = (): Gif[] => {

//   const gifs = localStorage.getItem('Gifs');

//   return gifs ? JSON.parse(gifs) : [];

// };
