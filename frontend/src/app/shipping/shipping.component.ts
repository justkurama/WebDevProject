import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { Cart, CartItem, Product } from '../models/models';
import { AuthService } from '../services/auth.service';
import { CartService } from '../services/cart.service';
import { CategoryService } from '../services/category.service';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-shipping',
  templateUrl: './shipping.component.html',
  styleUrls: ['./shipping.component.css']
})
export class ShippingComponent implements OnInit {
  isLoggedIn: boolean | undefined;
  cart: Cart | undefined;
  products: Product[] = [];

  constructor(
    private authService: AuthService, 
    private cartService: CartService, 
    private productService: ProductService,
    private categoryService: CategoryService
  ) {}

  ngOnInit() {
    this.isLoggedIn = this.authService.isLoggedIn();
    this.loadCart();
  }

  loadCart() {
    this.cartService.getCart().subscribe({
      next: (cart) => {
        this.enrichCartItems(cart);
      },
      error: (error) => console.error('Error loading the cart', error)
    });
  }

  enrichCartItems(cart: Cart) {
    const productRequests = cart.items.map(item =>
      this.productService.getProductById(item.product).pipe(
        map(product => ({
          id: item.id,
          product: product as Product,
          quantity: item.quantity
        } as unknown as CartItem))
      )
    );
  
    forkJoin(productRequests).subscribe({
      next: (itemsWithDetails) => {
        this.cart = { ...cart, enrichedItems: itemsWithDetails }; 
        console.log('All products loaded', this.cart);
      },
      error: (error) => console.error('Error enriching cart items', error)
    });
  }
  
  
  

  updateQuantity(item: CartItem, quantity: number) {
    const updatedItem = {...item, quantity}; 
    this.cartService.updateCartItem(updatedItem).subscribe({
      next: () => {
        this.reloadCartItems();
      },
      error: (error) => console.error('Error updating item', error)
    });
  }

  removeItem(itemId: number) {
    if (!this.cart) {
      console.error('Cart is not loaded.');
      return;
    }
    this.cartService.removeItemFromCart(itemId).subscribe({
      next: () => {
        this.cart!.items = this.cart!.items.filter(item => item.id !== itemId);
        console.log('Item removed', this.cart);
      },
      error: (error) => console.error('Error removing item from cart', error)
    });
  }

  private reloadCartItems() {
    if (this.cart) {
      this.loadCart();
    }
  }
}