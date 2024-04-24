import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router'; // Import Router
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-addproduct',
  templateUrl: './addproduct.component.html',
  styleUrls: ['./addproduct.component.css']
})
export class AddproductComponent implements OnInit {
  productForm!: FormGroup;

  constructor(
    private productService: ProductService,
    private router: Router  // Inject Router here
  ) {}

  ngOnInit() {
    this.productForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      price: new FormControl('', [Validators.required, Validators.pattern('^[0-9]+(\.[0-9]{1,2})?$')]),
      image: new FormControl('', [Validators.required]),
      category_id: new FormControl('', [Validators.required]),
      brand: new FormControl('', [Validators.required]),
      rating: new FormControl('', [Validators.required]),
    });
  }

  onSubmit() {
    if (this.productForm.valid) {
      this.productService.postProduct(this.productForm.value).subscribe({
        next: (response) => {
          console.log('Product added successfully!', response);
          this.router.navigate(['/']);
        },
        error: (error) => {
          console.error('Error adding product:', error);
          alert('Session expired or user not authenticated. Please login again.');
        }
      });
    }
  }
}
