import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent {
  isSignIn: boolean = false;
  username: string = '';
  password: string = '';
  email: string = '';
  first_name: string = '';
  last_name: string = '';


  constructor(private authService: AuthService, private router: Router) {} 


  toggleSignIn(isSignUpSelected: boolean): void {
    this.isSignIn = isSignUpSelected;
  }

  login(): void {
    this.authService.login(this.username, this.password).subscribe({
      next: (token) => {
        localStorage.setItem('token', token.access);
        this.router.navigate(['/']); 
      },
      error: (error) => {
        console.error('Login failed:', error);
        alert('Login failed: Incorrect username or password.'); 
      }
    });
  }

  signup(): void {
    this.authService.signup(this.username, this.first_name, this.last_name, this.email, this.password).subscribe({
      next: (user) => {
        alert('Registration successful! Go to login section');
        console.log('Signed up!', user);
        this.toggleSignIn(false); 
      },
      error: (error) => {
        alert('Signup failed: Please check the details and try again.');
      }
    });
  }
}
