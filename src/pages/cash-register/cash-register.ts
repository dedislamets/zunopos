import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IonicPage, LoadingController, NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import * as _ from 'lodash';
import * as moment from 'moment';

/**
 * Generated class for the CashRegisterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector: 'page-cash-register',
    templateUrl: 'cash-register.html',
})
export class CashRegisterPage {
    sales = [];
    salesAmount = [];
    userShifts = [];
    userName = '';
    days = [];

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        public loadingCtrl: LoadingController,
        private httpClient: HttpClient,
        private storage: Storage
    ) {
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad CashRegisterPage');
        this.getUserShifts();
    }

    getSales() {
        this.storage.get('user').then(user => {
            var filters = [];

            filters.push(/*{
                field: 'user_shift_id',
                operator: 'eq',
                value: '0',
                mode: 'and'
            }, */{
//                field: 'created_by_id',
//                operator: 'eq',
//                value: user['id'],
//                mode: 'and'
//            }, {
                field: 'paid',
                operator: 'eq',
                value: 1,
                mode: 'and'
            });

            this.storage.get('user_api').then(userApi => {
                var apiUrl = userApi.apiUrl;

                var param = {
                    select: 'id,payment_method_id,amount,payment_method__name,paid',
                    api_token: user['api_token'],
                    filter: JSON.stringify(filters)
                };

                this.httpClient.post('http://'+apiUrl+'/api/v1/sales', param).subscribe(data => {
                    if (data['sales'].length > 0) {
                        this.groupSales(data['sales']);
                    }
                });
            });
        });
    }

    public shiftDetail(userShift) {
        if (userShift.completed) {
            this.navCtrl.push('CashRegisterCompletePage', {userShift: userShift});
        }
        else {
            this.navCtrl.push('CashRegisterDetailPage', {userShift: userShift});
        }
    }

    groupSales (sales) {
        let salesGroup = [];
        let salesAmount = [];

        _.map(sales, sale => {
            sale.amount = parseFloat(sale.amount);
            return sale;
        });

        salesGroup = _.groupBy(sales, 'payment_method__name');

        let paymentMethods = Object.keys(salesGroup);

        for (let paymentMethod of paymentMethods) {
            let amount = _.sumBy(salesGroup[paymentMethod], 'amount');

            salesAmount.push({
                paymentMethodName: paymentMethod,
                amount: amount,
                amountDisplay: new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(amount),
                count: salesGroup[paymentMethod].length
            });
        }

        this.salesAmount = salesAmount;
    }

    private getUserShifts() {
        var api;
        var user;
        var filters = [];
        var sorters = [];

        let loader = this.loadingCtrl.create({
            content: "Please wait..."
        });

        loader.present();

        this.storage.get('user').then(user => {
            user = user;

            filters.push({
                field: 'user_id',
                operator: 'eq',
                value: user['id'],
                mode: 'and'
            });
        });

        sorters.push({
            field: 'sign_out_date',
            direction: 'DESC'
        });

        this.storage.get('user_api').then(userApi => {

            let param = {
                api_token: userApi['apiToken'],
                select: 'id,user_id,sign_in_date,sign_out_amount,sign_out_amount_actual,sign_out_amount_actual_card,sign_out_amount_actual_cash,sign_out_date,user__name',
                filter: JSON.stringify(filters),
                sorter: JSON.stringify(sorters)
            };

            this.httpClient.post('http://'+userApi['apiUrl']+'/api/v1/user_shifts', param).subscribe(data => {
                let shifts = [];

                for (let userShift of data['userShifts']) {
                    userShift.sign_out_date_time = moment(new Date(userShift['sign_out_date'])).format('h:mm');
                    userShift.completed = true;

                    if (moment().diff(new Date(userShift['sign_out_date']), 'days') == 0) {
                        userShift.group_date = '0';
                    }
                    else if (moment().diff(new Date(userShift['sign_out_date']), 'days') == 1) {
                        userShift.group_date = '1';
                    }
                    else {
                        userShift.group_date = moment(new Date(userShift['sign_out_date'])).format('YYYY-MM-DD')
                    }

                    shifts.push(userShift);
                }

                this.storage.get('user').then(user => {
                    shifts.unshift({
                        id: 0,
                        group_date: 0,
                        user__name: user['name'],
                        completed: false,
                        sign_out_date_time: '-'
                    });

                    this.groupUserShifts(shifts);
                });


                loader.dismiss();
            });
        });

        this.storage.get('user').then(user => {
            if (user !== null) {
                this.userName = user['name'];
            }
        });

    }

    private groupUserShifts(shifts) {
        let preGroup = _.groupBy(shifts, 'group_date');
        let dates = Object.keys(preGroup);
        let grouped = [];

        for (let date of dates) {
            grouped.push({
                date: date,
                dateName: (date == '0') ? 'HARI INI' : (date == '1') ? 'KEMARIN' : moment(date).format('DD MMMM YYYY'),
                userShifts: preGroup[date]
            })
        }

        this.userShifts = grouped;
    }
}
