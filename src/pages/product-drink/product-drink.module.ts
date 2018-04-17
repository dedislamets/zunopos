import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProductDrinkPage } from './product-drink';

@NgModule({
  declarations: [
    ProductDrinkPage,
  ],
  imports: [
    IonicPageModule.forChild(ProductDrinkPage),
  ],
})
export class ProductDrinkPageModule {}
