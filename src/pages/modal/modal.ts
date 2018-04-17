import { Component } from '@angular/core';
import { App, IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

@IonicPage()
@Component({
  selector: 'page-modal',
  templateUrl: 'modal.html',
})
export class ModalPage {
  private amount: any;
  private character: any;

  constructor(public navCtrl: NavController, public navParams: NavParams,
  		public viewCtrl: ViewController,
  		private app: App,
        private storage: Storage) {

        console.log(this.navParams.get('data'));
        if (this.navParams.get('amount') == undefined) {
            this.amount = 0;
        }else{
            this.amount = this.navParams.get('amount').amount;
        }
		    this.character = this.navParams.get('data');
  	}

  	ionViewDidLoad() {
    	console.log('ionViewDidLoad ModalPage');
  	}

  	dismiss() {
        this.viewCtrl.dismiss();
    }

    checkout() {
    	this.viewCtrl.dismiss();
        this.app.getRootNav().push('PaymentPage');
    }
    clearItem() {
        this.storage.remove('sale');
        this.amount = 0;
        this.character = null;
    }

}
