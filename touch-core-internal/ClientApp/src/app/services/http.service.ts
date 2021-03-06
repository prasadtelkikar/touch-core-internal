import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private http: HttpClient) { }

  get<T>(url: string): Observable<any> {
      return this.http.get<T>(environment.apiUrl + url);
  }

  post<T>(url: string, body: any, dataTableParameter?: any): Observable<any>{
      return this.http.post(environment.apiUrl + url, body);
  }

  put<T>(url: string, body: string): Observable<T> {
      return this.http.put<T>(environment.apiUrl + url, body);
  }

  delete<T>(url: string): Observable<T> {
      return this.http.delete<T>(environment.apiUrl + url);
  }

  patch<T>(url: string, body: string): Observable<T> {
      return this.http.patch<T>(environment.apiUrl + url, body);
  }
}
