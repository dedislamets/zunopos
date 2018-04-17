import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CashRegisterCompletePage } from './cash-register-complete';

@NgModule({
  declarations: [
    CashRegisterCompletePage,
  ],
  imports: [
    IonicPageModule.forChild(CashRegisterCompletePage),
  ],
})
export class CashRegisterCompletePageModule {}
