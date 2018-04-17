import { BluetoothSerial } from '@ionic-native/bluetooth-serial';
import { Injectable } from '@angular/core';
import { AlertController, LoadingController } from 'ionic-angular';

@Injectable()
export class PrintProvider {

    constructor(
          private alertCtrl:AlertController,
          private bluetoothSerial:BluetoothSerial,
          private loadingCtrl:LoadingController
    ) {}

    print(text, address) {
        let loading = this.loadingCtrl.create({
            content: 'Printing...'
        });

        loading.present();

        this.bluetoothSerial.list().then(listData => {
            let connect = this.bluetoothSerial.connect(address).subscribe(connectData => {
                this.bluetoothSerial.write(text+"\n\n\n").then(writeData => {
                    connect.unsubscribe();
                    loading.dismiss();
                },
                connectError => {
                    this.alertCtrl.create({
                        buttons: ['OK'],
                        message: connectError,
                        title: 'Error',
                    }).present();
                });
            }, listError => {
                this.alertCtrl.create({
                    buttons: ['OK'],
                    message: listError,
                    title: 'Error',
                }).present();
            });
        });
    }
}
