# Snatch-It — Full-Stack E-Commerce Platform

Snatch-It is a modern e-commerce web app with a public storefront and an admin dashboard for managing products, orders, content, and media. Built with React and Spring Boot, it's designed for both performance and flexibility.

## Access the Application

- [https://snatch-it-frontend.vercel.app](https://snatch-it-frontend.vercel.app)

## Features

### Admin Dashboard

- Secure login with JWT authentication
- Product management with variants (color, size, price, stock)
- Category management with image support and nested structure
- Order management with live status updates
- Media library with folder-based image management
- Discount coupons (percentage or fixed amount)
- CMS for static pages like About and Privacy Policy
- Dashboard overview with key store metrics

### Storefront

- Browse products by category with filters
- Add to cart, checkout, and track orders
- Guest checkout and registered user accounts
- Online payment (Paymob) and Cash on Delivery
- Password reset via email

## Tech Stack

### Backend

- Java 21
- Spring Boot 3.x
- Spring Security (JWT)
- JPA (Hibernate)
- PostgreSQL

### Frontend

- React (Vite)
- React Router
- Axios
- Tailwind CSS

### Deployment

- Backend: Render (Docker)
- Frontend: Vercel
- Database: Supabase (PostgreSQL)

---

## Getting Started (Dev Setup)

### Requirements

- Java 21
- Node.js v18+
- PostgreSQL
- Maven

### Backend

1. Clone the backend repo
2. Create a file at `src/main/resources/application-local.properties` with:

   ```properties
   DB_URL=jdbc:postgresql://localhost:5432/your_db_name
   DB_USERNAME=your_user
   DB_PASSWORD=your_password
   JWT_SECRET=your-secret
   SENDGRID_API_KEY=your_sendgrid_api_key
   PAYMOB_API_KEY=your_paymob_api_key
   PAYMOB_INTEGRATION_ID=your_paymob_integration_id
   PAYMOB_HMAC_SECRET=your_paymob_hmac_secret
Start the server:

bash
Copy
Edit
./mvnw spring-boot:run
App will be running on http://localhost:8080

Frontend
Clone the frontend repo

Install dependencies:

bash
Copy
Edit
npm install
Create a .env.local file:

env
Copy
Edit
VITE_API_BASE_URL=http://localhost:8080
VITE_PAYMOB_IFRAME_ID=your_paymob_iframe_id
Run the development server:

bash
Copy
Edit
npm run dev
Visit http://localhost:5173

Admin Access
To test the admin panel:

Username: ali1

Password: ali1

