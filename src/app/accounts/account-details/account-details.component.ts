import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccountService } from '../account.service';
import { ActivatedRoute, Router } from '@angular/router';
import { BankAccount } from '../account';
import { TransactionService } from 'src/app/transactions/transaction.service';
import { Transaction } from 'src/app/transactions/transaction';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-account-details',
  templateUrl: './account-details.component.html',
  styleUrls: ['./account-details.component.scss']
})
export class AccountDetailsComponent implements OnInit {
  id: string;
  accountDetailsForm: FormGroup;
  transactions: Transaction[];
  mode: string = 'Create';

  transactionSubscription: Subscription; 

  constructor(
    private fb: FormBuilder, 
    private accountService: AccountService,
    private transactionService: TransactionService,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit() {
    this.id = this.route.snapshot.params.id;
    

    this.accountDetailsForm = this.fb.group({
      'name': ['', Validators.required],
      'description': ['', Validators.required],
      'icon': ['']
    })

    if (this.id) {
      this.viewMode()
      this.getAccount(this.id);
      this.getTransactions();
    }
  }

  addAccount() {
    this.accountService.create(this.accountDetailsForm.value).subscribe(() => {
      this.router.navigateByUrl('/accounts');
    })
  }

  deleteAccount() {
    this.accountService.delete(this.id).subscribe(() => {
      this.router.navigateByUrl('/accounts');
    })
  }

  updateAccount() {
    this.accountService.update(this.id, this.accountDetailsForm.value).subscribe(() => {
      this.router.navigateByUrl('/accounts');
    })
  }

  deleteTransaction(id: string) {
    this.transactionService.delete(id).subscribe((res) => {
      this.transactionService.refreshTransactions();
    })
  }

  private getAccount(id: string) {
    this.accountService.get(id).subscribe((acc) => {
      this.accountDetailsForm.patchValue({ 'name': acc.name, 'description': acc.description, 'icon': acc.icon})
    })
  }

  private getTransactions() {
    this.transactionSubscription = this.transactionService.transactions$.subscribe(transactions => {
      this.transactions = transactions.filter(trans => trans.accountId == this.id);
    });
  }

  viewMode() {
    this.accountDetailsForm.disable();
    this.mode = 'View';
  }

  editMode() {
    this.accountDetailsForm.enable();
    this.mode = 'Edit';
  }

  ngOnDestroy() {
    if (this.transactionSubscription)
    this.transactionSubscription.unsubscribe();
  }
}
