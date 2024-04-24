import { Component, OnInit } from '@angular/core';
import { Category, PaginatedProducts, Product } from '../models/models';
import { AuthService } from '../services/auth.service';
import { CategoryService } from '../services/category.service';
import { ProductService } from '../services/product.service';
import { Options } from 'ng5-slider';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
})
export class ProductListComponent implements OnInit {
  isLoggedIn: boolean | undefined;
  products: Product[] = [];
  categories: Category[] = [];
  totalProducts: number = 0;
  currentPage: number = 1;
  pageSize: number = 10;

  minPrice: number = 0; 
  maxPrice: number = 40000; 
  options: Options = {
    floor: 0,
    ceil: 40000,
    step: 10
  };

  selectedRating!: number ;



  constructor(
    public productService: ProductService, 
    public categoryService: CategoryService,
    private authService: AuthService
  ) {}

  

  ngOnInit(): void {
    this.loadProducts({});
    this.categoryService.getCategory().subscribe(categories => {
      this.categories = categories;
    });
    this.isLoggedIn = this.authService.isLoggedIn();
  }

  applyFilters(): void {
    const filterParams: any = {};
    if (this.minPrice !== undefined) {
      filterParams['price_from'] = this.minPrice;
    }
    if (this.maxPrice !== undefined) {
      filterParams['price_to'] = this.maxPrice;
    }
    if (this.selectedRating !== undefined) {
      filterParams['rating'] = this.selectedRating;
    }
    this.loadProducts(filterParams);
  }

  loadProducts(params?: any): void {
    const queryParams = {
      page: this.currentPage,
      page_size: this.pageSize,
      ...params
    };
    this.productService.getProducts(queryParams).subscribe({
      next: (data: PaginatedProducts) => {
        this.products = data.results;
        this.totalProducts = data.count;
      },
      error: (error) => console.error('Error loading products:', error)
    });
  }
  sortByPrice(direction: string): void {
    this.loadProducts({ ordering: direction === 'desc' ? '-price' : 'price' });
  }

  sortBy(field: string, direction: string): void {
    this.loadProducts({ ordering: `${direction === 'desc' ? '-' : ''}${field}` });
  }

  validatePriceRange(): void {
    if (this.minPrice > this.maxPrice) {
      this.maxPrice = this.minPrice;
    }
  }
  
  
  filterByCategory(categoryName: string): void {
    this.currentPage = 1;  
    this.loadProducts({ 'category__name': categoryName });
  }

  getRatingStars(rating: number): Array<number> {
    return Array.from({ length: rating }, (_, index) => index + 1);
  }
  
  getEmptyStars(rating: number): Array<number> {
    return Array.from({ length: 5 - rating }, (_, index) => index + 1);
  }

}
