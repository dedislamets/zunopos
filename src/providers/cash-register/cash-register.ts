import { AlertController} from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

/*
  Generated class for the CashRegisterProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class CashRegisterProvider {

    constructor(
        public alertCtrl: AlertController,
        public http: HttpClient,
        public storage: Storage
    ) {
        console.log('Hello CashRegisterProvider Provider');
    }

    showForm() {
        let prompt = this.alertCtrl.create({
            title: 'Update KAS',
            message: "Masukkan jumlah KAS.",
            enableBackdropDismiss: false,
            inputs: [{
                name: 'amount',
                placeholder: '0',
                type: 'number'
            }],
            buttons: [{
                text: 'Save',
                handler: data => {
                    if (data.amount <= 0) {
                        return false;
                    }

                    this.update(data)
                }
            }]
        });

        prompt.present();
    }

    update(data) {
        this.storage.set('cashRegister', 1);
        console.log(data);
    }
}
