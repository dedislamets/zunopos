import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoadingController, IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { HomePage } from '../../pages/home/home';
import * as moment from 'moment';

@IonicPage()
@Component({
    selector: 'page-pin',
    templateUrl: 'pin.html',
})
export class PinPage {
    private circle1: string = 'circle';
    private circle2: string = 'circle';
    private circle3: string = 'circle';
    private circle4: string = 'circle';
    private pin: string = '';

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        private httpClient: HttpClient,
        private loadingCtrl: LoadingController,
        private storage: Storage,
        private toastCtrl: ToastController) {

        storage.get('login').then(getData => {
            if (getData) {
                this.navCtrl.setRoot(HomePage);
            }
        });
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad PinPage');
    }

    private tapBackspace() {
        if (this.circle4 == 'circle-solid') {
            this.circle4 = 'circle';
            this.pin = this.pin.substring(0, this.pin.length - 1);
        } else if (this.circle3 == 'circle-solid') {
            this.circle3 = 'circle';
            this.pin = this.pin.substring(0, this.pin.length - 1);
        } else if (this.circle2 == 'circle-solid') {
            this.circle2 = 'circle';
            this.pin = this.pin.substring(0, this.pin.length - 1);
        } else {
            this.circle1 = 'circle';
            this.pin = this.pin.substring(0, this.pin.length - 1);
        }
    }

    private tapClear() {
        this.circle1 = 'circle';
        this.circle2 = 'circle';
        this.circle3 = 'circle';
        this.circle4 = 'circle';
        this.pin = '';
    }

    private tapNumber(number) {
        if (this.circle1 == 'circle') {
            this.circle1 = 'circle-solid';
            this.pin += number;
        } else if (this.circle2 == 'circle') {
            this.circle2 = 'circle-solid';
            this.pin += number;
        } else if (this.circle3 == 'circle') {
            this.circle3 = 'circle-solid';
            this.pin += number;
        } else {
            this.circle4 = 'circle-solid';
            this.pin += number;

            this.validatePin()
        }
    }

    private validatePin() {
        var username;

        let loader = this.loadingCtrl.create({
            content: "Please wait..."
        });

        loader.present();

		this.storage.get('username').then(getData => {
            if (getData) {
                username = getData;
            }
        });

        this.storage.get('user_api').then(userApi => {
            let param = {
                password: this.pin,
                username: username
            };

            let url = 'http://'+userApi.apiUrl+'/api/v1/login';

            this.httpClient.post(url, null, {params: param}).subscribe(
                data => {
                    this.storage.set('acl', data['acl']);
                    this.storage.set('user', data['user']);
                    this.storage.set('cashRegister', 0);

                    this.storage.set('user_api', {
                        apiUrl: userApi.apiUrl,
                        apiToken: data['user']['api_token'],
                        userId: data['user']['id']
                    });

                    this.navCtrl.setRoot(HomePage);

                    this.storage.get('last_login').then(data => {
                        if (data == null) {
                            this.storage.set('last_login', new Date());
                        }
                    });

                    loader.dismiss();
                }, err => {
                    loader.dismiss();
                    this.showError();
                }
            );
        });
    }

    showError() {
        this.tapClear();

        this.toastCtrl.create({
            closeButtonText: 'OK',
            duration: 1000,
            message: 'PIN salah. Harap coba lagi.',
            showCloseButton: true
        }).present();
    }
}
