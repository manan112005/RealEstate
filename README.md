# Kesar Realty - Real Estate Web Application & Portal

A full-stack, enterprise-grade real estate platform built with **React 19**, **Vite**, **Tailwind CSS**, **Node.js**, **Express**, **PostgreSQL (Sequelize ORM)**, and **Cloudinary**.

---

## 🌟 Overview

**Kesar Realty** is a real estate web platform designed to streamline property exploration, bank auction deals, pre-leased commercial investments, and real estate services. It comes equipped with a customer-facing portal and a full-featured Admin Management Dashboard.

---

## 🚀 Key Features

### 🏢 Customer-Facing Portal
- **Property Discovery**: Browse, filter, and search properties with filters for location, type, price ranges, status, and amenities.
- **Dedicated Categories**:
  - 🏷️ **Bank Auction Properties**: View distressed and auction properties with reserve prices, auction dates, and EMD details.
  - 💼 **Pre-Leased Commercials**: Commercial assets with verified tenants, ROI/cap rate metrics, and lease terms.
  - 🛠️ **Real Estate Services**: Property consultation, legal advisory, home loans, and valuation services.
- **Detailed Property Pages**: High-resolution image carousels (Swiper), interactive floor plans, neighborhood info, key specs, and direct inquiry forms.
- **Inquiry & Contact**: Direct message routing to the admin dashboard.
- **Responsive & Modern UI**: Built with Tailwind CSS, Framer Motion animations, Lucide icons, and SEO optimization via `react-helmet-async`.

### 🛡️ Admin Dashboard
- **Secure Authentication**: JWT-based authentication with encrypted passwords (`bcryptjs`) and protected routes.
- **Property Management**: Complete CRUD operations for properties, multi-image upload with Cloudinary integration, and custom amenity toggles.
- **Category & Location Management**: Add and manage property cities, localities, and hot zones.
- **Partner & Builder Management**: Showcase affiliated builder profiles and development partners.
- **Services Management**: Create, edit, and manage services offered.
- **Inquiry Center**: View, filter, and manage messages submitted by prospective clients.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 19 (Vite)
- **Routing**: React Router v7
- **Styling**: Tailwind CSS v4 + Vanilla CSS
- **Animations**: Framer Motion
- **Icons & UI**: Lucide React, React Icons, Swiper, RC Slider
- **SEO & Meta**: React Helmet Async
- **HTTP Client**: Axios

### Backend
- **Runtime**: Node.js
- **Framework**: Express 5
- **Database & ORM**: PostgreSQL + Sequelize ORM
- **Media & File Storage**: Cloudinary + Multer
- **Security & Utilities**: Helmet, Express Rate Limit, CORS, Morgan, JWT, BcryptJS

---

## 📁 Project Structure

```text
kesarrealtydemo/
├── backend/                  # Node.js Express API & Database Models
│   ├── src/
│   │   ├── config/           # Database & Cloudinary configurations
│   │   ├── controllers/      # Route controllers (Auth, Properties, Locations, etc.)
│   │   ├── middlewares/      # Auth guards, validation, error handlers
│   │   ├── models/           # Sequelize ORM schema definitions & sync scripts
│   │   ├── routes/           # Express API route endpoints
│   │   ├── seed/             # Seed scripts for initial data
│   │   ├── utils/            # Helper utilities
│   │   └── server.js         # Entry point for backend server
│   ├── .env.example          # Sample environment variables for backend
│   └── package.json
│
├── frontend/                 # React 19 + Vite Frontend Application
│   ├── src/
│   │   ├── assets/           # Static images, icons, and media
│   │   ├── components/       # Reusable UI components (Navbar, Footer, Modals, Cards)
│   │   ├── context/          # React Context providers (AuthContext)
│   │   ├── pages/
│   │   │   ├── admin/        # Admin management views (Dashboard, AddProperty, Messages)
│   │   │   └── public/       # Public client pages (Home, Properties, Detail, Contact)
│   │   ├── routes/           # App route configuration & protected route wrappers
│   │   ├── services/         # Axios API service instances
│   │   ├── App.jsx           # Main App component
│   │   └── main.jsx          # Vite React mounting point
│   └── package.json
│
├── .gitignore                # Global Git ignore rules
└── README.md                 # Project documentation
```

---

## ⚙️ Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.0 or higher recommended)
- [PostgreSQL](https://www.postgresql.org/) (v13 or higher)
- [Cloudinary Account](https://cloudinary.com/) (for property media uploads)

---

### 1. Backend Setup

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the `backend/` directory:
   ```env
   PORT=5000

   # Database Configuration
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=homespace
   DB_USER=postgres
   DB_PASSWORD=your_postgres_password

   # Authentication
   JWT_SECRET=your_jwt_secret_key_here

   # Cloudinary Configuration
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret

   # Allowed Frontend Origin
   FRONTEND_URL=http://localhost:5173
   ```

4. **Initialize Database Tables:**
   Sync Sequelize models with your PostgreSQL instance:
   ```bash
   node src/models/sync.js
   ```

5. **Start Backend Server:**
   - Development mode (with Nodemon):
     ```bash
     npm run dev
     ```
   - Production mode:
     ```bash
     npm start
     ```
   The backend API will run at `http://localhost:5000/api`.

---

### 2. Frontend Setup

1. **Navigate to the frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start Frontend Dev Server:**
   ```bash
   npm run dev
   ```
   Open your browser and navigate to `http://localhost:5173`.

4. **Build for Production:**
   ```bash
   npm run build
   ```

---

## 🔌 API Endpoints Reference

| Module | Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- | :--- |
| **Auth** | `POST` | `/api/auth/register` | Register new admin | Public |
| **Auth** | `POST` | `/api/auth/login` | Authenticate admin & receive JWT | Public |
| **Properties** | `GET` | `/api/properties` | Get all properties (with filters) | Public |
| **Properties** | `GET` | `/api/properties/:slug` | Get single property details | Public |
| **Properties** | `POST` | `/api/properties` | Create new property listing | Admin |
| **Properties** | `PUT` | `/api/properties/:id` | Update existing property | Admin |
| **Properties** | `DELETE` | `/api/properties/:id` | Delete property listing | Admin |
| **Locations** | `GET` | `/api/locations` | List all supported locations | Public |
| **Locations** | `POST` | `/api/locations` | Add new location | Admin |
| **Partners** | `GET` | `/api/partners` | List partner builders | Public |
| **Services** | `GET` | `/api/services` | List real estate services | Public |
| **Contact** | `POST` | `/api/contact` | Submit customer inquiry/message | Public |
| **Contact** | `GET` | `/api/contact` | Retrieve customer messages | Admin |

---

## 🛡️ License

This project is proprietary and intended for Kesar Realty. All rights reserved.
