import { Component, Input, OnInit } from '@angular/core';
import { Item } from '../../interfaces/item';

@Component({
  selector: 'app-cart-items',
  templateUrl: './cart-items.component.html',
  styleUrls: [ './cart-items.component.scss' ]
})
export class CartItemsComponent implements OnInit {
  @Input() article: Item;
  @Input() count: number;

  constructor() {
  }

  ngOnInit() {
  }

}
