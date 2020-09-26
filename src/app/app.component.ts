import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { BeepService } from './providers/beep.service';
import Quagga from 'quagga';
import { Item } from './interfaces/item';
import { ShoppingCart } from './classes/shopping-cart';
import { UpdateService } from './providers/update.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.scss' ]
})
export class AppComponent implements AfterViewInit {

  errorMessage: string;

  shoppingCart: ShoppingCart;

  private catalogue: Item[] = [
    { name: 'Item 1', ean: '8901063092297', image: 'assets/item.png', price: 10 },
    { name: 'Item 2', ean: '8901063093287', image: 'assets/item.png', price: 20 },
    { name: 'Item 3', ean: '6908060975181', image: 'assets/item.png', price: 30 }
  ];

  private lastScannedCode: string;
  private lastScannedCodeDate: number;

  constructor(private changeDetectorRef: ChangeDetectorRef,
              private beepService: BeepService,
              private updateService: UpdateService) {
    this.shoppingCart = new ShoppingCart();
  }

  ngAfterViewInit(): void {
    if (!navigator.mediaDevices || !(typeof navigator.mediaDevices.getUserMedia === 'function')) {
      this.errorMessage = 'getUserMedia is not supported';
      return;
    }

    Quagga.init({
        inputStream: {
          constraints: {
            facingMode: 'environment'
          },
          area: { // defines rectangle of the detection/localization area
            top: '40%',    // top offset
            right: '0%',  // right offset
            left: '0%',   // left offset
            bottom: '40%'  // bottom offset
          }
        },
        decoder: {
          readers: [ 'ean_reader' ]
          // Possible values are following but using one for demo purpose
          // code_128_reader (default)
          // ean_reader
          // ean_8_reader
          // code_39_reader
          // code_39_vin_reader
          // codabar_reader
          // upc_reader
          // upc_e_reader
          // i2of5_reader
          // 2of5_reader
          // code_93_reader
        }
      },
      (err) => {
        if (err) {
          this.errorMessage = `QuaggaJS could not be initialized, err: ${err}`;
        } else {
          Quagga.start();
          Quagga.onDetected((res) => {
            this.onBarcodeScanned(res.codeResult.code);
          });
        }
      });

    setTimeout(() => {
      this.updateService.checkForUpdates();
    }, 10000);
  }

  onBarcodeScanned(code: string) {
    // ignore duplicates for an interval of 3 seconds
    const now = new Date().getTime();
    if (code === this.lastScannedCode && (now < this.lastScannedCodeDate + 3000)) {
      return;
    }

    // Add unknown items for demo purpose else we can ignore them
    let item = this.catalogue.find(a => a.ean === code);
    if (!item) {
      item = { name: `Item ${this.catalogue.length + 1}`, ean: code, image: 'assets/item.png', price: (this.catalogue.length + 1) * 10 };
    }

    this.shoppingCart.addArticle(item);

    this.lastScannedCode = code;
    this.lastScannedCodeDate = now;
    this.beepService.beep();
    this.changeDetectorRef.detectChanges();
  }

}
