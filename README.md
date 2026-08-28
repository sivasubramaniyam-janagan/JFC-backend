# JFC Food Ordering API 🍔

Backend API for **JFC**, a food-ordering web application. The API handles user authentication, Google sign-in, product management, order creation and history, and password recovery through email OTP.

The backend provides RESTful APIs for the frontend and uses MongoDB to store users, products, and orders.

## Features

* 🔐 User registration and login
* 🔑 JWT-based authentication
* 🔵 Google sign-in
* 🔄 Password reset using email OTP
* 🍔 Product management
* 🛒 Order creation
* 📦 Order history and pagination
* 👨‍💼 Admin product and order management
* 📧 Email functionality for password reset

## Tech Stack

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT
* Nodemailer

## Requirements

* Node.js 18 or newer
* MongoDB deployment
* Gmail account with an app password for OTP emails

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Create a `.env` file

Create a `.env` file in the project root:

```env
MONGO_URI=<your-mongodb-connection-string>
GMAIL=<your-gmail-address>
GMAIL_APP_PASSWORD=<your-gmail-app-password>
JWT_SECRET=<a-long-random-secret>
```

**Do not commit `.env` or expose its values.**

### 3. Start the server

```bash
npm start
```

The API runs at:

```text
http://localhost:3000
```

## Authentication

Login endpoints return a JWT valid for one hour.

Send the token with protected requests using the `Authorization` header:

```http
Authorization: Bearer <token>
```

Public endpoints can be accessed without authentication, while admin-only operations and order creation require authentication.

## API Endpoints

All endpoints use JSON request and response bodies.

### Users

| Method | Endpoint                     | Description                                       |
| ------ | ---------------------------- | ------------------------------------------------- |
| `POST` | `/api/users/register`        | Register a new user                               |
| `POST` | `/api/users/login`           | Log in and receive a JWT                          |
| `POST` | `/api/users/google-login`    | Sign in using Google                              |
| `GET`  | `/api/users/get-users`       | Get all users — Admin only                        |
| `POST` | `/api/users/forgot-password` | Send a six-digit password-reset OTP               |
| `POST` | `/api/users/reset-password`  | Reset password using email, OTP, and new password |

### Products

| Method   | Endpoint                                  | Description                   |
| -------- | ----------------------------------------- | ----------------------------- |
| `GET`    | `/api/products`                           | Get available products        |
| `POST`   | `/api/products/add`                       | Create a product — Admin only |
| `PUT`    | `/api/products/edit-product/:productId`   | Update a product — Admin only |
| `DELETE` | `/api/products/delete-product/:productId` | Delete a product — Admin only |

### Orders

| Method | Endpoint                             | Description                                |
| ------ | ------------------------------------ | ------------------------------------------ |
| `POST` | `/api/orders/create-order`           | Create an order for the authenticated user |
| `GET`  | `/api/orders/get-orders/:pageNumber` | Get paginated orders                       |
| `PUT`  | `/api/orders/update-order/:orderId`  | Update order status — Admin only           |

### Create Order Example

```json
{
  "phone": "5551234567",
  "addressLine1": "123 Main Street",
  "addressLine2": "Apt 4",
  "city": "Colombo",
  "items": [
    {
      "productId": "P001",
      "quantity": 2
    }
  ]
}
```

## Project Structure

```text
controllers/    Request handlers
middlewares/    JWT authentication middleware
models/         Mongoose schemas
routers/        Express route definitions
index.js        Application entry point
```

## Frontend

The JFC frontend is maintained in a separate repository.

**Frontend Repository:**
https://github.com/sivasubramaniyam-janagan/JFC

## Notes

* CORS is enabled for all origins.
* MongoDB connection errors are logged when the server starts.
* Automated tests are not currently included.

## Author

**Sivasubramaniyam Janagan**
