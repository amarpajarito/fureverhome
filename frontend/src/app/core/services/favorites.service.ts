import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FavoritesService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/favorites';

  // Signal to track favorite dog IDs
  favoriteDogIds = signal<Set<number>>(new Set());

  /**
   * Load user's favorites from backend
   */
  loadFavorites(): Observable<number[]> {
    return this.http.get<number[]>(this.apiUrl).pipe(
      tap((dogIds) => {
        this.favoriteDogIds.set(new Set(dogIds));
      })
    );
  }

  /**
   * Add a dog to favorites
   */
  addFavorite(dogId: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${dogId}`, {}).pipe(
      tap(() => {
        const currentFavorites = new Set(this.favoriteDogIds());
        currentFavorites.add(dogId);
        this.favoriteDogIds.set(currentFavorites);
      })
    );
  }

  /**
   * Remove a dog from favorites
   */
  removeFavorite(dogId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${dogId}`).pipe(
      tap(() => {
        const currentFavorites = new Set(this.favoriteDogIds());
        currentFavorites.delete(dogId);
        this.favoriteDogIds.set(currentFavorites);
      })
    );
  }

  /**
   * Toggle favorite status
   */
  toggleFavorite(dogId: number): Observable<void> {
    if (this.isFavorite(dogId)) {
      return this.removeFavorite(dogId);
    } else {
      return this.addFavorite(dogId);
    }
  }

  /**
   * Check if a dog is favorited
   */
  isFavorite(dogId: number): boolean {
    return this.favoriteDogIds().has(dogId);
  }

  /**
   * Get count of favorites
   */
  getFavoriteCount(): number {
    return this.favoriteDogIds().size;
  }
}
