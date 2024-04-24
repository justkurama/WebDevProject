import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from '../models/models';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-updateproduct',
  templateUrl: './updateproduct.component.html',
  styleUrls: ['./updateproduct.component.css']
})
export class UpdateproductComponent implements OnInit {
  product: Product | undefined;
  productForm!: FormGroup;  

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = +params['id']; 
      if (!isNaN(id) && id > 0) {
        this.getProductById(id);
      } else {
        console.error('Invalid ID:', id);
        this.router.navigate(['/']);
      }
    });

    // Initialize the form group with form controls
    this.productForm = new FormGroup({
      name: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
      image: new FormControl('', Validators.required),
      price: new FormControl('', [Validators.required, Validators.pattern('^[0-9]+(\.[0-9]{1,2})?$')]),
      category_id: new FormControl('', Validators.required),
      brand: new FormControl('', Validators.required),
      rating: new FormControl('', [Validators.required, Validators.pattern('^[0-9]*$')])
    });
  }

  getProductById(id: number): void {    
    this.productService.getProductById(id).subscribe(
      product => {
        this.product = product;
        this.productForm.patchValue(product); 
      },
      error => console.error('Error fetching product:', error)
    );
  }

  updateProduct(): void {
    if (this.product && this.productForm.valid) { 
      this.productService.updateProduct(this.product.id, this.productForm.value).subscribe({
        next: (updatedProduct) => {
          console.log('Product updated:', updatedProduct);
          this.router.navigate(['/']);
        },
        error: (error) => console.error('There was an error updating the product!', error)
      });
    } else {
      console.error('No product is selected or form is invalid.');
    }
  }
  
}
