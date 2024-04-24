import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { Review } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private BASE_URL = 'http://localhost:8000/api/';

  constructor(private http: HttpClient) {}

  getReviews(productId?: number): Observable<Review[]> {
    let url = `${this.BASE_URL}review/`;
    if (productId) {
      url += `?product_id=${productId}`;
    }
    return this.http.get<Review[]>(url)
      .pipe(
        catchError(this.handleError)
      );
  }


  getReviewById(id: number): Observable<Review> {
    const url = `${this.BASE_URL}review/${id}`;
    return this.http.get<Review>(url)
      .pipe(
        catchError(this.handleError)
      );
  }


  createReview(review: Review): Observable<Review> {
    const url = `${this.BASE_URL}review/`;
    return this.http.post<Review>(url, review, this.httpOptions())
      .pipe(
        catchError(this.handleError)
      );
  }


  updateReview(id: number, review: Review): Observable<Review> {
    const url = `${this.BASE_URL}review/${id}`;
    return this.http.put<Review>(url, review, this.httpOptions())
      .pipe(
        catchError(this.handleError)
      );
  }


  deleteReview(id: number): Observable<{}> {
    const url = `${this.BASE_URL}review/${id}`;
    return this.http.delete(url, this.httpOptions())
      .pipe(
        catchError(this.handleError)
      );
  }


  private handleError(error: HttpErrorResponse) {
    console.error('Backend returned code', error.status, 'body was:', error.error);
    if (error.error instanceof ErrorEvent) {

      console.error('An error occurred:', error.error.message);
    } else {


      console.error(`Backend returned code ${error.status}, body was:`, error.error);
    }

    return throwError(() => new Error('Something bad happened; please try again later.'));
  }


  private httpOptions() {
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.getToken()}`
      })
    };
  }
  
  
  private getToken(): string {

    return localStorage.getItem('token') || '';
  }
}
