# Web Development Project

---
![Hello](luffy.jpg)
---

## Description

This is a web application built using Django for the backend and Angular for the frontend. This application allows users to browse and purchase products from different categories. It includes user authentication and authorization features for secure access to the platform.

## Team members

Tolebayev Kurmanbek `22B030597`
Alimbetova Ayazhan `22B030500`

## Features

- User authentication and authorization
- Product browsing by category
- Product listing with details and reviews
- Add to cart functionality
- User profile management
- Admin panel for managing users, products, and categories

## Technologies Used

### Backend (Django)
- Django
- Django REST Framework
- PostgreSQL (or any other database of your choice)
- Authentication: Django's built-in authentication system or JWT tokens

### Frontend (Angular)
- Angular
- Angular Material (for UI components)
- TypeScript
- RxJS

## Installation

### Backend Setup

1. Clone the repository.
2. Navigate to the backend directory: `cd backend`.
3. Install dependencies: `pip install -r requirements.txt`.
4. Set up database and configure settings in `settings.py`.
5. Run migrations: `python manage.py migrate`.
6. Create a superuser: `python manage.py createsuperuser`.
7. Start the Django development server: `python manage.py runserver`.

### Frontend Setup

1. Navigate to the frontend directory: `cd frontend`.
2. Install dependencies: `npm install`.
3. Configure environment variables if necessary.
4. Start the Angular development server: `ng serve`.

## Usage

1. Access the Django admin panel to manage users, products, and categories: `http://localhost:8000/admin`.
2. Access the frontend application: `http://localhost:4200`.

## Contributing

Contributions are welcome! Please follow the standard GitHub flow: fork the repository, create a new branch, make your changes, and open a pull request.
