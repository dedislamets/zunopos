import { AlertController, IonicPage, LoadingController, NavController, NavParams, ViewController } from 'ionic-angular';
import { Component } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Nav, Platform } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import * as _ from 'lodash';
import * as moment from 'moment';

/**
 * Generated class for the CashRegisterRecapPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector: 'page-cash-register-recap',
    templateUrl: 'cash-register-recap.html',
    providers:[CurrencyPipe]
})
export class CashRegisterRecapPage {
    input = {
        amount_cash: '',
        amount_card: ''
    };

    amountTotal = 0;
    sales = [];
    salesAmount = {};

    constructor(
        public alertCtrl: AlertController,
        public currencyPipe: CurrencyPipe,
        public loadingCtrl: LoadingController,
        public nav: Nav,
        public navCtrl: NavController,
        public navParams: NavParams,
        public viewCtrl: ViewController,

        private httpClient: HttpClient,
        private storage: Storage
    ) {
        this.getSales();
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad CashRegisterRecapPage');
    }

    calculateAmount() {
        let amountCash = (this.input.amount_cash != '') ? parseFloat(this.input.amount_cash) : 0;
        let amountCard = (this.input.amount_card != '') ? parseFloat(this.input.amount_card) : 0;

        this.amountTotal = amountCash + amountCard;
    }

    submitForm() {
        let loader = this.loadingCtrl.create({
            content: 'Please wait...'
        });

        let lastLogin = this.navParams.get('lastLogin');
        let transactions = this.navParams.get('transactions');
        let transactionsAmount = this.getTransactionsAmount(transactions);

        loader.present();

        this.storage.get('user').then(user => {
            this.storage.get('user_api').then(userData => {
                let param = {
                    api_token: String(userData.apiToken),
                    location_id: '1',
                    user_id: user['id'],
                    sign_in_date: moment(this.navParams.get('lastLogin')).format('YYYY-MM-DD HH:mm:ss'),
                    sign_out_date: moment().format('YYYY-MM-DD HH:mm:ss'),
                    sign_out_amount: String(transactionsAmount + this.salesAmount['total']),
                    sign_out_amount_actual: String(this.amountTotal),
                    sign_out_amount_actual_card: (this.input.amount_card) ? this.input.amount_card : '0',
                    sign_out_amount_actual_cash: (this.input.amount_cash) ? this.input.amount_cash : '0',
                    sign_out_amount_cancelled: '0',
                    sign_out_amount_card: String(this.salesAmount['card']),
                    sign_out_amount_cash: String(this.salesAmount['cash'])
                };

                let apiUrl = 'http://'+userData.apiUrl+'/api/v1/user_shift';

                this.httpClient.post(apiUrl, null, {params: param}).subscribe(
                data => {
                    loader.dismiss();
                    this.viewCtrl.dismiss();
                    this.nav.setRoot('CashRegisterPage');
                }, err => {
                    let alert = this.alertCtrl.create({
                        title: 'Error!',
                        subTitle: err.message
                    });

                    alert.present()
                });
            });
        });

    }

    getSales() {
        var filters = [];
        var sorters = [];


        this.storage.get('user_api').then(userApi => {
            filters.push({
                field: 'created_by_id',
                operator: 'eq',
                value: userApi['userId'],
                mode: 'and'
            }, {
                field: 'settled',
                operator: 'eq',
                value: 0,
                mode: 'and'
            });

            let param = {
                select: 'created_by_id,settled,id,payment_method_id,payment_method__name,amount,date',
                api_token: String(userApi['apiToken']),
                filter: JSON.stringify(filters),
                sorter: JSON.stringify(sorters)
            };

            let apiUrl = 'http://'+userApi['apiUrl']+'/api/v1/sales';

            this.httpClient.post(apiUrl, null, {params: param}).subscribe(
            data => {
                if (data['success']) {
                    this.sales = data['sales'];
                    this.salesAmount = this.groupSalesAmount(data['sales']);
                }
                else {
                    let alert = this.alertCtrl.create({
                        title: 'Error!',
                        subTitle: data['message']
                    });

                    alert.present()
                }
            }, err => {
                let alert = this.alertCtrl.create({
                    title: 'Error!',
                    subTitle: err['message']
                });

                alert.present()
            });
        });

    }

    groupSalesAmount(sales) {
        let groupSales = _.groupBy(sales, 'payment_method_id');
        let groupSalesPayment = [];
        let groupSalesAmount = {
            card: 0,
            cash: 0,
            total: 0,
        };

        for (let paymentMethodId of Object.keys(groupSales)) {
            groupSalesPayment.push({
                payment_method_id: parseInt(paymentMethodId),
                amount: _.sumBy(groupSales[paymentMethodId], sale => { return parseFloat(sale.amount)})
            });
        }

        for (let paymentMethod of groupSalesPayment) {
            if (paymentMethod.payment_method_id == 1) {
                groupSalesAmount.cash += paymentMethod.amount;
            }
            else {
                groupSalesAmount.card += paymentMethod.amount;
            }

            groupSalesAmount.total += paymentMethod.amount;
        }

        return groupSalesAmount;
    }

    getTransactionsAmount(transactions) {
        let groupTransactions = _.groupBy(transactions, 'type');

        for (let key of Object.keys(groupTransactions)) {
            groupTransactions[key] = _.sumBy(groupTransactions[key], transaction => { return parseFloat(transaction.amount); });
        }

        return groupTransactions['in'] - groupTransactions['out'];
    }

}
