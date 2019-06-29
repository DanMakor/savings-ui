import { NgModule } from '@angular/core';
import { AccountListComponent } from './account-list/account-list.component';
import { AccountDetailsComponent } from './account-details/account-details.component';
import { SharedModule } from '../shared/shared.module';
import { Routes, RouterModule } from '@angular/router';
import { TransactionsModule } from '../transactions/transactions.module';

const routes: Routes = [
  { path: 'accounts', component: AccountListComponent },
  { path: 'accounts/create', component: AccountDetailsComponent },
  { path: 'accounts/edit/:id', component: AccountDetailsComponent }
];

@NgModule({
  declarations: [AccountListComponent, AccountDetailsComponent],
  imports: [
    SharedModule,
    RouterModule.forChild(routes),
    TransactionsModule
  ],
  exports: [AccountListComponent, AccountDetailsComponent]
})
export class AccountsModule { }
