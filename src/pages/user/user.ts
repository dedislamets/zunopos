/**
 * Import Plugins and Components
 */
import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IonicPage, LoadingController, NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';

/**
 * Generated class for the UserPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-user',
  templateUrl: 'user.html',
})

export class UserPage {
    public userList: any;

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        public loadingCtrl: LoadingController,
        private httpClient: HttpClient,
        private storage: Storage
    ) {
        this.loadUser();
    }

    ionViewDidLoad() {
        //this.storage.clear();
        console.log('ionViewDidLoad UserPage');
    }

    loadUser() {
        let loader = this.loadingCtrl.create();
        loader.present();

		this.storage.get('user_api').then(userData => {
            let filter = [];

            filter.push({
                field: 'type_employee',
                operator: 'like',
                value: 'cashier',
                mode: 'and'
            });

            let param = {
                api_token: userData.apiToken,
                //api_token: '4915736d-6124-4da1-86f6-23b64f3198fe',
				select: 'id,name,username',
                filter: JSON.stringify(filter)
            };

            let apiUrl = 'http://'+userData.apiUrl+'/api/v1/users';

            this.httpClient.post(apiUrl, null, {params: param}).subscribe(
            getData => {
                this.userList = getData['users'];

                loader.dismiss();
            }, err => {
                console.log(err);
            });
        });
    }

	selectUser(user) {
		this.storage.set('username', user.username);
		this.navCtrl.push('PinPage');
	}

}
