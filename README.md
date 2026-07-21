# Emojud Sales & Inventory Management

Emojud is a modern web application for managing sales, inventory, purchases, expenses, customers, suppliers, employees, and reporting. The project is built with Next.js 16, React 19, and Tailwind CSS, and it is designed as a dashboard-driven ERP-style system for small and mid-sized businesses.

Crafted by Suman Sarker.

---

## Live Demo

- Live URL: https://emojud.vercel.app/
- Recruiter username: `suman`
- Recruiter password: `12345678`

The root route redirects to the login screen, so recruiters can open the live URL and sign in directly with the demo account above.

---

## Overview

This application includes modules for:

- Dashboard and business overview
- Shops, warehouses, departments, and designations
- Products, categories, and subcategories
- Suppliers, customers, and customer due collection
- Purchases, invoices, expenses, and salary management
- Commission-profit reports, stock summary, and supplier payments
- User roles, permissions, and shop-based access control

---

## Tech Stack

- Next.js 16
- React 19
- Tailwind CSS 4
- JavaScript
- PostgreSQL with Node.js pg driver
- JWT-based authentication
- Cloudinary uploads
- Recharts, SweetAlert2, and React Toastify

---

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Create a `.env.local` file in the project root and define the required values, for example:

```env
DATABASE_URL=your_postgresql_connection_string
JWT_SECRET=your_jwt_secret
JWT_ACCESS_EXPIRES=900
JWT_REFRESH_EXPIRES=604800
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_API_IMG_URL=http://localhost:3000
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 3. Run the application

```bash
npm run dev
```

Open http://localhost:3000 and the app will redirect to the login screen.

---

## Available Scripts

```bash
npm run dev     # start the development server
npm run build   # create a production build
npm run start   # start the production server
npm run lint    # run ESLint
```

---

## Project Structure

```text
src/
├── app/              # Next.js App Router pages and API routes
├── components/       # Reusable UI components
├── constants/        # Navigation and app constants
├── data/             # Static or mock data used by views
├── feature/          # App feature pages and layouts
├── lib/              # Shared utilities, auth, database, and API helpers
├── services/         # API/service layer for modules
└── middleware.js     # Route protection and auth middleware
```

---

## Notes

- Authentication flow and token handling are implemented under the API routes in the app.
- PostgreSQL connection setup is managed in the database helper located in the lib folder.
- The UI is structured around feature-based routes, with the main application shell defined under the feature section.

---

## Roadmap

Planned improvements include:

- Expanding forms for create/edit workflows
- Improving reporting and analytics
- Strengthening role and permission management
- Adding more polished loading and error states
