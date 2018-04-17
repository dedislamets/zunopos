import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CashRegisterPage } from './cash-register';

@NgModule({
  declarations: [
    CashRegisterPage,
  ],
  imports: [
    IonicPageModule.forChild(CashRegisterPage),
  ],
})
export class CashRegisterPageModule {}
