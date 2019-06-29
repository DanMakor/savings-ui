import { Injectable } from '@angular/core';
import { Observable, Subject, ReplaySubject, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Transaction } from './transaction';
import { tap, map } from 'rxjs/operators';

const url = 'http://localhost:3000/api/transactions'

@Injectable({
  providedIn: 'root'
})
export class TransactionService {

  openSubject: Subject<any> = new Subject();
  open$: Observable<any> = this.openSubject.asObservable();

  transactionsSubject: ReplaySubject<Transaction[]> = new ReplaySubject(1);
  transactions$: Observable<Transaction[]> = this.transactionsSubject.asObservable();

  constructor(private http: HttpClient) {
    this.refreshTransactions();
  }

  refreshTransactions() {
    this.http.get<Transaction[]>(url).pipe(
      map(transactions => transactions.sort((a,b) => {
        if (a.date && b.date) {
          return new Date(b.date).getTime() - new Date(a.date).getTime()
        } else if (a.date) {
          return -1;
        } else if (b.date) {
          return 1;
        } else {
          return 0;
        }
      }))
    ).subscribe(transactions => {
      this.transactionsSubject.next(transactions);
    });
  }

  create(obj: Transaction) {
    return this.http.post<Transaction>(url + '/create', obj).pipe(
      tap(() => {
        this.refreshTransactions();
      })
    );
  }

  createMultiple(obj: Transaction[]) {
    return this.http.post<Transaction[]>(url + '/createmany', obj).pipe(
      tap(() => {
        this.refreshTransactions();
      })
    )
  }
  
  delete(id: string) {
    return this.http.delete<any>(url + '/delete/' + id);
  }

  openModal(transactionConfig: any) {
    this.openSubject.next(transactionConfig);
  }

}
