# 🖥️ E-Commerce Backend

> Full-stack E-Commerce platform - Built with Java Spring Boot & ReactJS

## 📁 Repository Structure

```
E-Commerce-Java-Spring-Boot-And-ReactJS/
├── main/                          # Backend (this repository: pc-ecom)
│   ├── src/
│   │   └── main/java/com/ecommerce/project/
│   │       ├── Controller/        # REST API Controllers (7 controllers)
│   │       ├── model/             # JPA Entity classes (11 entities)
│   │       ├── repositories/      # Spring Data JPA Repositories (10 repos)
│   │       ├── service/           # Business logic (interface + implementation)
│   │       ├── payload/           # DTOs & API response objects (19 DTOs)
│   │       ├── security/          # Spring Security, JWT, auth configs
│   │       │   ├── jwt/           # JWT filter, utils, entry point
│   │       │   ├── request/       # Login & Signup request models
│   │       │   ├── response/      # Auth response models
│   │       │   └── services/      # UserDetailsService implementation
│   │       ├── config/            # App config, Swagger, constants
│   │       ├── exceptions/        # Global exception handling
│   │       └── util/              # Utility classes (AuthUtil)
│   └── pom.xml                    # Maven dependencies
│
└── frontend/                      # Frontend (pc-ecom-frontend)
    ├── src/
    │   ├── components/            # React components                 # Page components
    │   ├── store/                 # Redux state management
    │   └── ...
    └── package.json               # NPM dependencies
```

## 📋 Technology Stack

| Technology        | Version | Description                    |
| ----------------- | ------- | ------------------------------ |
| Spring Boot       | 4.0.3   | Core framework                 |
| Java              | 25      | Programming language           |
| MySQL             | -       | Production database            |
| Spring Data JPA   | -       | ORM / Hibernate                |
| Spring Security   | -       | Security framework             |
| JWT (jjwt)        | 0.13.0  | Token-based authentication     |
| Stripe SDK        | 32.0.0  | Online payment processing      |
| SpringDoc OpenAPI | 3.0.2   | API Documentation (Swagger UI) |
| ModelMapper       | 3.2.4   | Entity ↔ DTO mapping           |
| Lombok            | -       | Reduce boilerplate code        |
| Jackson           | 2.17.0  | JSON processing                |
| Maven             | -       | Build tool                     |

## 👥 Role System

| Role            | Permissions                                                                 |
| --------------- | --------------------------------------------------------------------------- |
| **ROLE_USER**   | Browse products, manage cart, place orders, manage addresses                |
| **ROLE_SELLER** | USER permissions + manage own products, view & update orders                |
| **ROLE_ADMIN**  | SELLER permissions + manage categories, all products, all orders, analytics |

**Default accounts (seed data):**

- `user1` / `password1` → USER
- `seller1` / `password2` → SELLER
- `admin` / `adminPass` → ADMIN

**URL Authorization:**

- `/api/auth/**`, `/api/public/**` → Public
- `/api/admin/**` → ADMIN only
- `/api/seller/**` → ADMIN or SELLER
- Others → Authenticated

---

## 🔐 1. Authentication & Authorization

**Controller:** `AuthController.java` | **Service:** `AuthServiceImpl.java`

| Method | Endpoint             | Access | Description                                        |
| ------ | -------------------- | ------ | -------------------------------------------------- |
| POST   | `/api/auth/signin`   | Public | Sign in, returns JWT Cookie                        |
| POST   | `/api/auth/signup`   | Public | Register account (supports role selection)         |
| POST   | `/api/auth/signout`  | Public | Sign out, clears JWT Cookie                        |
| GET    | `/api/auth/username` | Public | Get current username                               |
| GET    | `/api/auth/user`     | Public | Get full user details (id, username, roles, email) |
| GET    | `/api/auth/sellers`  | Public | List all sellers (paginated)                       |

**Details:**

- Sign in: authenticates via `AuthenticationManager`, creates JWT token in HTTP-only Cookie
- Sign up: checks duplicate username/email, hashes password with BCrypt, defaults to ROLE_USER
- Sign out: clears JWT cookie (sets empty cookie)
- Session: Stateless (no server-side session storage)

---

## 📂 2. Category Management

**Controller:** `CategoryController.java` | **Service:** `CategoryServiceImpl.java`

| Method | Endpoint                             | Access | Description                              |
| ------ | ------------------------------------ | ------ | ---------------------------------------- |
| GET    | `/api/public/categories`             | Public | Get all categories (paginated, sortable) |
| POST   | `/api/admin/categories`              | Admin  | Create new category                      |
| PUT    | `/api/admin/categories/{categoryId}` | Admin  | Update category                          |
| DELETE | `/api/admin/categories/{categoryId}` | Admin  | Delete category                          |

---

## 🛍️ 3. Product Management

**Controller:** `ProductController.java` | **Service:** `ProductServiceImpl.java`

The most complex feature with 13 endpoints serving Public, Admin, and Seller roles.

### 3.1 Public APIs

| Method | Endpoint                                       | Description                                              |
| ------ | ---------------------------------------------- | -------------------------------------------------------- |
| GET    | `/api/public/products`                         | Get all products (supports `keyword`, `category` filter) |
| GET    | `/api/public/categories/{categoryId}/products` | Filter products by category                              |
| GET    | `/api/public/products/keyword/{keyword}`       | Search products by keyword                               |

### 3.2 Admin APIs

| Method | Endpoint                                     | Description                             |
| ------ | -------------------------------------------- | --------------------------------------- |
| GET    | `/api/admin/products`                        | List all products                       |
| POST   | `/api/admin/categories/{categoryId}/product` | Create new product                      |
| PUT    | `/api/admin/products/{productId}`            | Update product                          |
| DELETE | `/api/admin/products/{productId}`            | Delete product                          |
| PUT    | `/api/admin/products/{productId}/image`      | Upload/update product image (multipart) |

### 3.3 Seller APIs

| Method | Endpoint                                      | Description                |
| ------ | --------------------------------------------- | -------------------------- |
| GET    | `/api/seller/products`                        | List seller's own products |
| POST   | `/api/seller/categories/{categoryId}/product` | Create product             |
| PUT    | `/api/seller/products/{productId}`            | Update product             |
| DELETE | `/api/seller/products/{productId}`            | Delete product             |
| PUT    | `/api/seller/products/{productId}/image`      | Upload product image       |

**Product fields:** productName, image, description, quantity, price, discount, specialPrice, category, seller

---

## 🛒 4. Cart Management

**Controller:** `CartController.java` | **Service:** `CartServiceImpl.java`

| Method | Endpoint                                              | Access | Description                                            |
| ------ | ----------------------------------------------------- | ------ | ------------------------------------------------------ |
| POST   | `/api/cart/create`                                    | Auth   | Create/update cart (bulk - multiple items)             |
| POST   | `/api/carts/products/{productId}/quantity/{quantity}` | Auth   | Add product to cart                                    |
| GET    | `/api/carts`                                          | Auth   | Get all carts                                          |
| GET    | `/api/carts/users/cart`                               | Auth   | Get current user's cart                                |
| PUT    | `/api/cart/products/{productId}/quantity/{operation}` | Auth   | Increase/decrease quantity (`delete` = -1, other = +1) |
| DELETE | `/api/carts/{cartId}/product/{productId}`             | Auth   | Remove product from cart                               |

**Model:** Each User has 1 Cart (1:1), Cart contains multiple CartItems (1:N), CartItem links to Product

---

## 📦 5. Order Management

**Controller:** `OrderController.java` | **Service:** `OrderServiceImpl.java`

| Method | Endpoint                                    | Access | Description                           |
| ------ | ------------------------------------------- | ------ | ------------------------------------- |
| POST   | `/api/order/users/payments/{paymentMethod}` | Auth   | Place order (creates order from cart) |
| POST   | `/api/order/stripe-client-secret`           | Auth   | Create Stripe PaymentIntent           |
| GET    | `/api/admin/orders`                         | Admin  | View all orders (paginated)           |
| PUT    | `/api/admin/orders/{orderId}/status`        | Admin  | Update order status                   |
| GET    | `/api/seller/orders`                        | Seller | View seller's orders                  |
| PUT    | `/api/seller/orders/{orderId}/status`       | Seller | Update order status (seller)          |

**Order flow:**

1. User adds products → Cart
2. Selects shipping address + payment method
3. If Stripe: call `/stripe-client-secret` → get `clientSecret` → frontend completes payment
4. Call `/order/users/payments/{method}` with payment info → creates Order

**Order fields:** orderId, email, orderItems, orderDate, totalAmount, orderStatus, payment, address

---

## 💳 6. Stripe Payment Integration

**Service:** `StripeServiceImpl.java`

**Stripe Payment Flow:**

1. Frontend sends `StripePaymentDTO` (email, name, amount, currency, description, address)
2. Backend searches Stripe Customer by email → creates new if not found
3. Creates `PaymentIntent` with automatic payment methods enabled
4. Returns `clientSecret` for frontend to complete payment

**Payment model:** paymentMethod, pgPaymentId, pgStatus, pgResponseMessage, pgName (1:1 with Order)

---

## 📍 7. Address Management

**Controller:** `AddressController.java` | **Service:** `AddressServiceImpl.java`

| Method | Endpoint                     | Access | Description                  |
| ------ | ---------------------------- | ------ | ---------------------------- |
| POST   | `/api/addresses`             | Auth   | Create new address           |
| GET    | `/api/addresses`             | Auth   | Get all addresses            |
| GET    | `/api/addresses/{addressId}` | Auth   | Get address by ID            |
| GET    | `/api/users/addresses`       | Auth   | Get current user's addresses |
| PUT    | `/api/addresses/{addressId}` | Auth   | Update address               |
| DELETE | `/api/addresses/{addressId}` | Auth   | Delete address               |

**Address fields:** street, buildingName, city, state, country, pinCode

---

## 📊 8. Analytics Dashboard

**Controller:** `AnalyticsController.java` | **Service:** `AnalyticsServiceImpl.java`

| Method | Endpoint                   | Access | Description        |
| ------ | -------------------------- | ------ | ------------------ |
| GET    | `/api/admin/app/analytics` | Admin  | Get analytics data |

**Response:** `productCount`, `totalOrders`, `totalRevenue`

---

## ⚙️ Cross-cutting Concerns

| Feature                | Description                                                              |
| ---------------------- | ------------------------------------------------------------------------ |
| **JWT Security**       | Stateless authentication, HTTP-only Cookie, BCrypt password hashing      |
| **CORS**               | Configured to allow frontend cross-origin requests                       |
| **Swagger UI**         | Auto-generated API docs at `/swagger-ui/`, supports Bearer JWT           |
| **Pagination**         | All list APIs support `pageNumber`, `pageSize`, `sortBy`, `sortOrder`    |
| **Exception Handling** | `MyGlobalExceptionHandler` → `APIException`, `ResourceNotFoundException` |
| **File Upload**        | MultipartFile for product images, served at `/images/**`                 |
| **Validation**         | `@Valid`, `@NotBlank`, `@Size`, `@Email`                                 |
| **DTO Pattern**        | 19 DTOs separating domain model from API response                        |
| **Data Seeding**       | Auto-creates 3 roles + 3 default users on startup                        |

---

## 🗃️ Data Model

```
User ──1:N── Address       User ──1:1── Cart       User ──1:N── Product (seller)
User ──N:M── Role          Category ──1:N── Product
Cart ──1:N── CartItem      CartItem ──N:1── Product
Order ──1:N── OrderItem    Order ──1:1── Payment   Order ──N:1── Address
```

**11 Entities:** User, Role, AppRole(enum), Address, Category, Product, Cart, CartItem, Order, OrderItem, Payment

---

## 📈 Project Summary

| Item            | Count                          |
| --------------- | ------------------------------ |
| Controllers     | 7                              |
| Services        | 9 interface + 9 implementation |
| Entities/Models | 11                             |
| Repositories    | 10                             |
| DTOs/Payloads   | 19                             |
| API Endpoints   | ~38                            |
| Roles           | 3                              |
