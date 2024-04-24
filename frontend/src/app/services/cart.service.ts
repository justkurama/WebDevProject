import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { Cart, CartItem } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  getCategoryById(id: number) {
    throw new Error('Method not implemented.');
  }
  private BASE_URL = 'http://localhost:8000/api/';

  constructor(private http: HttpClient) {}

  getCart(): Observable<Cart> {
    return this.http.get<Cart>(`${this.BASE_URL}cart`);
  }
  
  handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Unknown error!';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Client-side Error: ${error.error.message}`;
    } else {
      errorMessage = `Server-side Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.error('Error occurred:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }


  addProductToCart(productId: number, quantity: number = 1): Observable<any> {
    return this.http.post<any>(`${this.BASE_URL}add-to-cart/${productId}/`, { quantity })
        .pipe(catchError(this.handleError));
}


updateCartItem(item: CartItem): Observable<CartItem> {
  return this.http.put<CartItem>(`${this.BASE_URL}update-cart-item/${item.id}/`, item)
    .pipe(catchError(this.handleError));
}

  removeItemFromCart(itemId: number): Observable<any> {
    return this.http.delete(`${this.BASE_URL}delete-cart-item/${itemId}/`);
  }
}
