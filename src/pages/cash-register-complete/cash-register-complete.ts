import { AlertController, IonicPage, LoadingController, NavController, NavParams } from 'ionic-angular';
import { Component } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { PrintProvider } from '../../providers/print/print';
import { ViewController } from 'ionic-angular';

import * as _ from 'lodash';
import * as moment from 'moment';
import * as numeral from 'numeral';

/**
 * Generated class for the CashRegisterCompletePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector: 'page-cash-register-complete',
    templateUrl: 'cash-register-complete.html',
    providers:[CurrencyPipe]
})
export class CashRegisterCompletePage {
    public amountDeviation: any;
    public amountSystem: any;
    public salesAmount: any;
    public signOutAmount: any;
    public signOutAmountActual: any;
    public signOutAmountActualCard: any;
    public signOutAmountActualCash: any;
    public transactionsAmountIn: any;
    public transactionsAmountOut: any;
    public userShift: any;
    public userShiftDetail: any;

    private loader: any;

    constructor(
        public alertCtrl: AlertController,
        public currencyPipe: CurrencyPipe,
        public loadingCtrl: LoadingController,
        public navCtrl: NavController,
        public navParams: NavParams,
        public viewCtrl: ViewController,

        private httpClient: HttpClient,
        private printProvider: PrintProvider,
        private storage: Storage
    ) {
        this.loader = this.loadingCtrl.create();
        this.loader.present();

        this.userShift = this.navParams.get('userShift');
        this.userShift['sign_in_date_format'] = moment(this.userShift['sign_in_date']).format('DD MMMM YYYY h:mm:ss');
        this.userShift['sign_out_date_format'] = moment(this.userShift['sign_out_date']).format('DD MMMM YYYY h:mm:ss');

        this.getTransactions();
        this.getSales();

        this.amountDeviation = parseFloat(this.userShift['sign_out_amount_actual']) - parseFloat(this.userShift['sign_out_amount']);
        this.signOutAmount = parseFloat(this.userShift['sign_out_amount']);
        this.signOutAmountActual = parseFloat(this.userShift['sign_out_amount_actual']);
        this.signOutAmountActualCard = parseFloat(this.userShift['sign_out_amount_actual_card']);
        this.signOutAmountActualCash = parseFloat(this.userShift['sign_out_amount_actual_cash']);
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad CashRegisterCompletePage');
        this.loader.dismiss();
    }

    getSalesAmount(sales) {
        return _.sumBy(sales, sale => {
            return parseFloat(sale.amount)
        });
    }

    getTransactionsAmount(transactions, type) {
        let transactionsType = _.groupBy(transactions, 'type');
        let transactionsAmount = {};

        transactionsAmount[type] = _.sumBy(transactionsType[type], transaction => {
            return parseFloat(transaction['amount']);
        });

        return transactionsAmount[type];
    }

    getSales() {
        var filters = [];
        var sorters = [];

        this.storage.get('user_api').then(userApi => {
            filters.push({
                field: 'user_shift_id',
                operator: 'eq',
                value: this.userShift['id'],
                mode: 'and'
            });

            let param = {
                select: 'id,created_by_id,user_shift_id,settled,amount',
                api_token: String(userApi['apiToken']),
                filter: JSON.stringify(filters),
                sorter: JSON.stringify(sorters)
            };

            let apiUrl = 'http://'+userApi['apiUrl']+'/api/v1/sales';

            this.httpClient.post(apiUrl, null, {params: param}).subscribe(
            data => {
                if (data['success']) {
                    this.salesAmount = this.getSalesAmount(data['sales']);
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

    getTransactions() {
        var filters = [];
        var sorters = [];


        this.storage.get('user_api').then(userApi => {
            filters.push({
                field: 'user_shift_id',
                operator: 'eq',
                value: this.userShift['id'],
                mode: 'and'
            });

            let param = {
                select: 'id,created_by_id,user_shift_id,amount,settled,type',
                api_token: String(userApi['apiToken']),
                filter: JSON.stringify(filters),
                sorter: JSON.stringify(sorters)
            };

            let apiUrl = 'http://'+userApi['apiUrl']+'/api/v1/transactions';

            this.httpClient.post(apiUrl, null, {params: param}).subscribe(
            data => {
                if (data['success']) {
                    this.transactionsAmountIn = this.getTransactionsAmount(data['transactions'], 'in');
                    this.transactionsAmountOut = this.getTransactionsAmount(data['transactions'], 'out');
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

    printCashRegister() {
        let length = 30;
        let strLength;
        let SpaceLength;

        let printStr = {
            sale: {
                label: 'Penjualan',
                value: numeral(this.salesAmount).format('0,0')
            },
            transactionIn: {
                label: 'Kas Masuk',
                value: numeral(this.transactionsAmountIn).format('0,0')
            },
            transactionOut: {
                label: 'Kas Keluar',
                value: numeral(this.transactionsAmountOut).format('0,0')
            },
            amountSystem: {
                label: 'Penerimaan Sistem',
                value: numeral(this.signOutAmount).format('0,0')
            },
            amountActual: {
                label: 'Penerimaan Aktual',
                value: numeral(this.signOutAmountActual).format('0,0')
            },
            deviation: {
                label: 'Selisih',
                value: numeral(this.amountDeviation).format('0,0')
            }
        };

        let text = '';
        let signInDateFormat = moment(this.userShift['sign_in_date']).format('DD/MM/YY H:mm');
        let signOutDateFormat = moment(this.userShift['sign_out_date']).format('DD/MM/YY H:mm');
        let printedDateFormat = moment(new Date()).format('DD/MM/YY H:mm');

        text = '            REKAP KAS          \n';
        text += '-------------------------------\n';
        text += 'Cashier:  ' + this.userShift['user__name'] +'\n';
        text += 'Open:  ' + signInDateFormat +'\n';
        text += 'Close:  ' + signOutDateFormat +'\n';
        text += '-------------------------------\n';

        let printStrKeys = Object.keys(printStr);

        for (let key of printStrKeys) {
            text += printStr[key]['label'];

            let strLen = printStr[key]['label'].length + printStr[key]['value'].length;

            for (let i = 0; i <= (length - strLen); i++ ) {
                text += ' ';
            }

            text += printStr[key]['value'];
            text += '\n';
        }

        text += '\n\n';
        text += '-------------------------------\n';
        text += 'Printed On:  ' + printedDateFormat +'\n';
        text += '-------------------------------\n';

        this.storage.get('id_printer').then(address => {
            this.printProvider.print(text, address);
        });
    }
}
