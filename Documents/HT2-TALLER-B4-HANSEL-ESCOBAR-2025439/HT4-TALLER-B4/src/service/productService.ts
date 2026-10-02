import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { delay } from "rxjs/operators";
import { Product } from "../model/productModel";

@Injectable({
    providedIn: 'root'
})

export class ProductService {
    saveProduct(product: Product): Observable<{ status : string; data: Product}> {
        console.log('[ProductService] Enviando producto al backend: ', product);

        return of({
            status: 'success',
            data: {...product, id: Math.floor(Math.random() * 1000) + 1}
        }).pipe(delay(1000));
    }
}