import { Component, OnInit } from '@angular/core';
import { AccountService } from '../account.service';
import { TransactionService } from 'src/app/transactions/transaction.service';
import { BankAccount } from '../account';
import { Subscription } from 'rxjs';

@Component({
  selector: 'account-list',
  templateUrl: './account-list.component.html',
  styleUrls: ['./account-list.component.scss']
})
export class AccountListComponent implements OnInit {

  accounts: BankAccount[];
  accountsTotal: number;
  transactionAccount: BankAccount;
  transactionType: string;

  transactionSub: Subscription;

  constructor(
    private accountService: AccountService,
    private transactionService: TransactionService
  ) { }

  ngOnInit() {
    this.accountService.getAll().subscribe(accounts => {
      this.transactionSub = this.transactionService.transactions$.subscribe(transactions => {
        this.accountsTotal = transactions.reduce((a,b) => a + b.amount, 0);
        this.accounts = accounts.map(acc => {
          const allTransactions = transactions.filter(t => t.accountId === acc._id);
          acc.transactions = allTransactions.slice(0, 10);
          acc.total = allTransactions.reduce((a,b) => a + b.amount, 0);
          return acc;
        })
      })
    });
  }

  addTransaction(transactionAccounts: BankAccount[], transactionType: string) {
    let transactionConfig = {
      accounts: transactionAccounts,
      type: transactionType
    };
    this.transactionService.openModal(transactionConfig);
  }

  ngOnDestroy() {
    this.transactionSub.unsubscribe();
  }
}
