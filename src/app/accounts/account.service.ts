import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { BankAccount } from './account';

const url = 'http://localhost:3000/api/accounts'

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  constructor(private http: HttpClient) { }

  get(id: string): Observable<BankAccount> {
    return this.http.get<BankAccount>(url + '/' + id);
  }

  getAll(): Observable<BankAccount[]> {
    return this.http.get<BankAccount[]>(url);
  }

  update(id: string, obj: BankAccount): Observable<BankAccount> {
    return this.http.post<BankAccount>(url + '/' + id + '/update', obj);
  }
  
  create(obj: BankAccount): Observable<any> {
    return this.http.post(url + '/create', obj);
  }

  delete(id: string): Observable<any> {
    return this.http.delete(url + '/delete/' + id);
  }


}
