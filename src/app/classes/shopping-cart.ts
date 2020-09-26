import { Item } from './item';

export class ShoppingCart {

  items: Map<Item, number>;

  constructor() {
    this.items = new Map<Item, number>();
  }

  addArticle(article: Item) {
    if (this.items.has(article)) {
      this.items.set(article, this.items.get(article) + 1);
    } else {
      this.items.set(article, 1);
    }
  }

  get isEmpty(): boolean {
    return this.items.size === 0;
  }

  get totalPrice(): number {
    let total = 0;
    for (const entry of this.items.entries()) {
      total += entry[0].price * entry[1];
    }
    return total;
  }
}
