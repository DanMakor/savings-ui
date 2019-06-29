import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { TransactionComponent } from './transaction/transaction.component';

@NgModule({
  declarations: [TransactionComponent],
  imports: [
    SharedModule
  ],
  exports: [TransactionComponent]
})
export class TransactionsModule { }
