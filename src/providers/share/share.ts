import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class ShareProvider {
    public sale: any;
    private saleItem: any;
    private inv: any;

    constructor(public http: HttpClient) {
        console.log('Hello ShareProvider Provider');
    }

    getInvoice() {
        return this.inv;
    }

    getSale() {
        return this.sale;
    }

    getSaleItem() {
        return this.saleItem;
    }

    setInvoice(idInvoice) {
        this.inv = idInvoice;
    }

    setSale(updatedSale) {
        this.sale = updatedSale;
    }

    setSaleItem(updatedSaleItem) {
        this.saleItem = updatedSaleItem;
    }


}
