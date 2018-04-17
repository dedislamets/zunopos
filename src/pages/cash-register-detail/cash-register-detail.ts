import { Component } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AlertController, IonicPage, LoadingController, ModalController, NavController, NavParams, PopoverController, ToastController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { ViewController } from 'ionic-angular';
import * as moment from 'moment';

/**
 * Generated class for the CashRegisterDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@Component({
    templateUrl: 'cash-in-out-form.html',
    providers:[CurrencyPipe]
})
export class CashInOutModal {
    input = {
        type: '',
        amount: '',
        description: ''
    }

    constructor(
        public alertCtrl: AlertController,
        public currencyPipe: CurrencyPipe,
        public loadingCtrl: LoadingController,
        public navCtrl: NavController,
        public navParams: NavParams,
        public popoverCtrl: PopoverController,
        public viewCtrl: ViewController,

        private httpClient: HttpClient,
        private storage: Storage
    ) {
    }

    closeForm() {
        this.viewCtrl.dismiss();
    }

    submitForm() {
        var transaction_items = [];

        let valid = this.validateForm();

        if (!valid) {
            return false;
        }

        transaction_items.push({
            coa_credit_id: '1.1.01.01',
            coa_debit_id: '1.1.01.01',
            payment_method_id: '1',
            amount: this.input.amount
        });

        let loader = this.loadingCtrl.create();
        loader.present();


        this.storage.get('user_api').then(userApi => {
            let param = {
                account_id: '1',
                api_token: String(userApi['apiToken']),
                date: moment().format('YYYY-MM-DD h:mm:ss'),
                description: this.input['description'],
                location_id: '1',
                name: '',
                transaction_items: JSON.stringify(transaction_items),
                type: this.input['type'],
                user_id: userApi['userId']
            };

            if (this.input.type == 'in') {
                param['number'] = ''
            }

            let apiUrl = 'http://'+userApi.apiUrl+'/api/v1/transaction';

            this.httpClient.post(apiUrl, null, {params: param}).subscribe(
            data => {
                loader.dismiss();
                this.viewCtrl.dismiss();
            }, err => {
                let alert = this.alertCtrl.create({
                    title: 'Error!',
                    subTitle: err.message
                });

                alert.present()
            });
        });
    }

    validateForm() {
        try {
            if (this.input.type == '') throw 'Jenis Kas';
            if (this.input.amount == '') throw 'Jumlah';

            return true;
        }
        catch(err) {
            let alert = this.alertCtrl.create({
                title: 'Error!',
                subTitle: err + ' harus diisi.'
            });

            alert.present();

            return false;
        }


    }
}

@IonicPage()
@Component({
    selector: 'page-cash-register-detail',
    templateUrl: 'cash-register-detail.html',
})
export class CashRegisterDetailPage {
    userShift = {};
    transactions = [];

    constructor(
        public alertCtrl: AlertController,
        public loadingCtrl: LoadingController,
        public modalCtrl: ModalController,
        public navCtrl: NavController,
        public navParams: NavParams,
        public toastCtrl: ToastController,
        public popoverCtrl: PopoverController,

        private httpClient: HttpClient,
        private storage: Storage
    ) {
        this.userShift = this.navParams.get('userShift');
        this.userShift['sign_in_date_format'] = moment(this.userShift['sign_in_date']).format('DD MMMM YYYY h:mm:ss');
        this.userShift['sign_out_date_format'] = moment(this.userShift['sign_out_date']).format('DD MMMM YYYY h:mm:ss');
    }

    ionViewDidLoad() {
        this.loadTransactions();
    }

    cashInOutForm() {
        let modal = this.modalCtrl.create(CashInOutModal);

        modal.onDidDismiss(() => {
            this.loadTransactions();
        });

        modal.present();
    }

    cashRegisterRecap() {
        this.storage.get('last_login').then(lastLogin => {
            this.navCtrl.push('CashRegisterRecapPage', {
                lastLogin: lastLogin,
                transactions: this.transactions
            });
        });
    }

    loadTransactions() {
        var filters = [];
        var sorters = [];

        let loader = this.loadingCtrl.create();
        loader.present();

        this.storage.get('user').then(user => {
            filters.push({
                field: 'user_id',
                operator: 'eq',
                value: user['id'],
                mode: 'and'
            }, {
                field: 'settled',
                operator: 'eq',
                value: 0,
                mode: 'and'
            });

            sorters.push({
                field: 'date',
                direction: 'DESC'
            });

            this.storage.get('user_api').then(userData => {
                let param = {
                    api_token: userData.apiToken,
                    select: 'id,user_shift_id,settled,type,amount,description,date',
                    filter: JSON.stringify(filters),
                    sorter: JSON.stringify(sorters)
                };

                let apiUrl = 'http://'+userData.apiUrl+'/api/v1/transactions';

                this.httpClient.post(apiUrl, null, {params: param}).subscribe(
                data => {
                    this.transactions = data['transactions'];
                    this.renderTransactions();

                    loader.dismiss();
                }, err => {
                    let alert = this.alertCtrl.create({
                        title: 'Error!',
                        subTitle: err.message
                    });

                    alert.present();
                    loader.dismiss();
                });
            });
        });
    }

    private renderTransactions() {
        for (let transaction of this.transactions) {
            transaction.amount_display = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(transaction.amount);
        }
    }

}
