import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProductFoodPage } from './product-food';

@NgModule({
  declarations: [
    ProductFoodPage,
  ],
  imports: [
    IonicPageModule.forChild(ProductFoodPage),
  ],
})
export class ProductFoodPageModule {}
