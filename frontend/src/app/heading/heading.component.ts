import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-heading', // adjust the selector as needed for your specific header component
  templateUrl: './heading.component.html',
  styleUrls: ['./heading.component.css']
})
export class HeadingComponent implements OnInit {
  isLoggedIn: boolean | undefined;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.isLoggedIn = this.authService.isLoggedIn(); // Check login status on component initialization
  }

  logout() {
    localStorage.removeItem('token'); // Clear the token from localStorage
    this.isLoggedIn = false; // Update the internal login status
  }
}
