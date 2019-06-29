import { Component, OnInit, ViewChild } from '@angular/core';
import { TransactionService } from '../transaction.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { Transaction } from '../transaction';
import { Subscription } from 'rxjs';
import { BankAccount } from 'src/app/accounts/account';

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.scss']
})
export class TransactionComponent implements OnInit {
  @ViewChild('content') content;
  type: string;
  accounts: BankAccount[];

  transactionForm: FormGroup;
  get transactions() {
    return this.transactionForm.get('transactions') as FormArray;
  }
  sub: Subscription; 

  constructor(
    private transactionService: TransactionService,
    private modalService: NgbModal,
    private fb: FormBuilder) {}

  ngOnInit() {
    this.transactionForm = this.fb.group({
      'transactions': this.fb.array([])
    });
  }

  ngAfterViewInit() {
    this.sub = this.transactionService.open$.subscribe((config) => {
        config.accounts.forEach((acc) => {
        this.transactions.controls.push(this.fb.group({
          'transactionType': [config.type],
          'accountName': [{ value: acc.name, disabled: true }],
          'accountId': [acc._id],
          'amount': [null, Validators.required],
          'description': [null]
        }));
      });
      this.type = config.type;
      this.accounts = config.accounts;
      this.open(this.content, config.accounts.length > 1 ? 'xl' : 'lrg');
    })
  }

  createTransaction() {
    let validState = true;
    this.transactions.controls.forEach(ctrl => {
      if (!ctrl.valid) { validState = false; }
    });
    if (validState) { 
      let transactionsForSaving: Transaction[] = [];
      this.transactions.controls.forEach(ctrl => {
        let transactionForSaving = ctrl.value;
        if (this.type === 'Withdraw') { 
          transactionForSaving.amount = -(transactionForSaving.amount)
        }
        transactionForSaving.date = new Date();
        transactionsForSaving.push(transactionForSaving);
      })
      this.transactionService.createMultiple(transactionsForSaving)
        .subscribe(() => {
          this.transactionForm.reset();
          this.modalService.dismissAll();
        }
      )
    } else {
      this.transactions.controls.forEach(ctrl => {
        ctrl.get('amount').markAsTouched();
      });
    }
  }

  open(content, size) {
    this.modalService.open(content, { size: size }).result
      .then(() => {         
        this.transactionForm = this.fb.group({
          'transactions': this.fb.array([])
        }); 
      }, 
      () => {         
        this.transactionForm = this.fb.group({
          'transactions': this.fb.array([])
        }); 
      });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

}
