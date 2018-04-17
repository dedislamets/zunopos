import { HttpClientModule } from '@angular/common/http';
import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicStorageModule } from '@ionic/storage';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { Network } from '@ionic-native/network';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { SuccessPage } from '../pages/success/success';
import { ModalPage } from '../pages/modal/modal';
import { CashInOutModal } from '../pages/cash-register-detail/cash-register-detail';
import { AuthProvider } from '../providers/auth/auth';
import { PrintProvider } from '../providers/print/print';
import { ShareProvider } from '../providers/share/share';
import { CashRegisterProvider } from '../providers/cash-register/cash-register';

@NgModule({
    declarations: [
        CashInOutModal,
        MyApp,
        HomePage,
        SuccessPage,
        ModalPage
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        IonicModule.forRoot(MyApp),
        IonicStorageModule.forRoot()
    ],
    bootstrap: [IonicApp],
    entryComponents: [
        HomePage,
        CashInOutModal,
        ModalPage,
        MyApp,
        SuccessPage
    ],
    providers: [
        SplashScreen,
        StatusBar,
        {provide: ErrorHandler, useClass: IonicErrorHandler},
        AuthProvider,
        BluetoothSerial,
        PrintProvider,
        ShareProvider,
        Network,
        CashRegisterProvider
    ]
})
export class AppModule {}
