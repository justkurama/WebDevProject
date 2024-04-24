import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Category, Product, Review } from '../models/models';
import { AuthService } from '../services/auth.service';
import { CartService } from '../services/cart.service';
import { CategoryService } from '../services/category.service';
import { ProductService } from '../services/product.service';
import { ReviewService } from '../services/review.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {
  product: Product | undefined;
  category: Category | undefined;
  isLoggedIn: boolean | undefined;
  reviews: Review[] = [];
  reviewContent: string = '';
  reviewRating: number | null = null;
  productId: number | null = null;

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private route: ActivatedRoute,
    private cartService: CartService,
    private router: Router,
    private authService: AuthService,
    private reviewService: ReviewService  
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
        this.productId = +params['id'];
        if (this.productId && this.productId > 0) {
            this.getProductById(this.productId);
            this.getReviews(this.productId);
        } else {
            console.error('Invalid ID:', this.productId);
            this.router.navigate(['/']);
        }
    });
}


submitReview(): void {
  if (!this.productId || this.reviewRating === null) {
      console.error('Product details or rating missing!');
      return;
  }

  const newReview: Review = {
      product: this.productId,
      content: this.reviewContent,
      rating: this.reviewRating
  };

  this.reviewService.createReview(newReview).subscribe({
      next: review => {
          this.reviews.push(review);
          this.reviewContent = '';
          this.reviewRating = null;
          console.log('Review submitted successfully!');
      },
      error: error => console.error('Failed to submit review:', error)
  });
}


  getProductById(id: number): void {
    this.isLoggedIn = this.authService.isLoggedIn();
    
    this.productService.getProductById(id).subscribe(
      product => {
        this.product = product;
        if (product.category_id) {
          this.getCategory(product.category_id); 
        } else {
          console.error('Product does not have a category_id');
        }
      },
      error => console.error('Error fetching product:', error)
    );
  }

  addToCart(productId: number): void {
    this.cartService.addProductToCart(productId).subscribe({
        next: (response) => {
            console.log('Product added to cart successfully!', response);
        },
        error: (error) => console.error('Error adding product to cart:', error)
    });
}
  getReviews(productId: number): void {
    this.reviewService.getReviews(productId).subscribe(
      reviews => {
        this.reviews = reviews;
      },
      error => console.error('Error fetching reviews:', error)
    );
  }
  
  

  getCategory(id: number): void {
    this.categoryService.getCategoryById(id).subscribe(category =>{ this.category = category;},error => console.error('Error fetching product:', error));
  }

  getRatingStars(rating: number): Array<number> {
    return new Array(rating);
  }

  getEmptyStars(rating: number): Array<number> {
    return new Array(5- rating);
  }

  deleteProduct(): void{
if(this.product){
  this.productService.deleteProduct(this.product.id).subscribe({
    next: () => {
      console.log('Product deleted');
      this.router.navigate(['/']);
    },
    error: (error) => console.error('Error deleting the vacancy', error)
  })
}
  }


  
}
