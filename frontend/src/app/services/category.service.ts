import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { Category } from '../models/models';
@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private BASE_URL = 'http://localhost:8000/api/';
  constructor(private http: HttpClient){}
  
  getCategory():  Observable<Category[]>{
    return this.http.get<Category[]>(`${this.BASE_URL}categories/`).pipe(catchError(this.handleError));
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
  getCategoryById(id: number): Observable<Category> {
    return this.http.get<Category>(`${this.BASE_URL}categories/${id}`).pipe(catchError(this.handleError));
}

}
