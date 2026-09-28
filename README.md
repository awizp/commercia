# Commercia

Commercia is a full-stack ecommerce web platform designed for discovering, purchasing, and managing modern consumer goods and electronics. 

It provides an end to end shopping experience featuring catalog exploration, cart management, checkout with Razorpay payments, verified buyer review workflows, and a full administrative dashboard.

---

## How It Works

1. **Storefront & Catalog**: 

    - Browse products using real time search 
    - Category filtering 
    - Price sliders
    - Server side pagination

2. **Cart & Orders**: 

    - Add items with automatic stock validation
    - Manage quantities
    - Proceed through checkout

3. **Verified Reviews**:

    - Add, edit, or delete ratings and reviews exclusively after your order has reached the "Delivered" milestone

4. **Admin Dashboard**: 

    - Manage inventory
    - Upload product images to Cloudinary
    - Track order fulfillment
    - Update user roles
    - Moderate reviews

---

## Tech Stack

- **Frontend**: 

        React, Redux Toolkit, React Router, Tailwind CSS, Vite, Lucide React

- **Backend**: 

        Node.js, Express.js

- **Database**: 

        MongoDB Atlas with Mongoose

- **Cloud Storage & Payments**: 

        Cloudinary, Razorpay

- **Authentication**:
 
        JWT via HTTP only cookies

---

## Installation & Local Setup

### 1. Clone the Repository

```bash
git clone [https://github.com/awizp/commercia.git](https://github.com/awizp/commercia.git)
cd commercia
```

### 2. Install & Run Backend

```bash
cd backend
npm install
npm start
```

### 3. Install & Run Frontend

```bash
cd frontend
npm install
npm run dev
```

## Screenshot

![Commercia UI](https://github.com/awizp/commercia/blob/main/screenshot/home.png)

## Author

    Vishnuprakash R