import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbModalModule, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [],
  imports: [
    HttpClientModule,
    CommonModule,
    ReactiveFormsModule,
    NgbModalModule,
    NgbDropdownModule
  ],
  exports: [
    HttpClientModule,
    CommonModule,
    ReactiveFormsModule,
    NgbModalModule,
    NgbDropdownModule
  ]
})
export class SharedModule { }
