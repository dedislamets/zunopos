import { Component, ViewChild } from '@angular/core';
import { HomePage } from '../pages/home/home';
import { Nav, Platform } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

@Component({
    templateUrl: 'app.html',
})
export class MyApp {
    @ViewChild(Nav) nav: Nav;

    rootPage: any = 'LoginPage';

    pages: Array<{title: string, component: any}>;

    constructor(
        platform: Platform,
        splashScreen: SplashScreen,
        statusBar: StatusBar
    ) {
        platform.ready().then(() => {
            splashScreen.hide();
            statusBar.backgroundColorByHexString('#ffa530');
            statusBar.styleLightContent();
        });

        this.pages = [
            { component: HomePage, title: 'Point Of Sale' },
            { component: 'HistoryPage', title: 'Activity' },
            { component: 'SettingPage', title: 'Pengaturan' },
            { component: 'UserPage', title: 'Ganti Kasir' },
            { component: 'CashRegisterPage', title: 'Pengaturan KAS' },
            { component: 'ExitPage', title: 'Keluar' }
        ];
    }

    openPage(page) {
        this.nav.setRoot(page.component);
    }
}
