import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
    selector: 'page-exit',
    templateUrl: 'exit.html',
})
export class ExitPage {

    constructor(public navCtrl: NavController, public navParams: NavParams,
        private storage: Storage) {
        storage.set('login', '');
        storage.set('login_customer', '');

        this.navCtrl.setRoot('LoginPage');
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad ExitPage');
    }

}
