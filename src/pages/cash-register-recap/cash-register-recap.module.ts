import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CashRegisterRecapPage } from './cash-register-recap';

@NgModule({
  declarations: [
    CashRegisterRecapPage,
  ],
  imports: [
    IonicPageModule.forChild(CashRegisterRecapPage),
  ],
})
export class CashRegisterRecapPageModule {}
