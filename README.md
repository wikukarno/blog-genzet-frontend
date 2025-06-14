# 📰 Blog Genzet - Frontend

This is the frontend project for the Blog Genzet application. It allows users to view articles, search, filter by category, and provides an admin preview page. Built with **Next.js (App Router)**, **React**, **Tailwind CSS**, and integrated with a Laravel backend API.

## 📁 Project Structure

```plaintext
app/
├── (auth)/ # Authentication pages
├── articles/ # Public article listing page
│ └── preview/[id]/ # Public article preview (slug-based)
├── admin/ # Admin dashboard pages
│ ├── articles/ # List, create, edit articles
│ ├── categories/ # Category management
│ └── profile/ # Admin profile
components/ # UI components (HeroSection, Footer, Card, etc.)
hooks/ # React Query hooks (fetch articles, categories, etc.)
services/ # API service layer
styles/ # Global styles and Tailwind configuration
types/ # TypeScript types and interfaces
public/ # Static assets (images, icons)
next.config.js # Next.js configuration
package.json # Project dependencies and scripts
README.md # Project documentation
```

## 🚀 Technologies Used

- **Next.js (v14+)**
- **React**
- **Tailwind CSS**
- **TinyMCE** (rich text editor)
- **React Query** (data fetching)
- **Radix UI** (Dropdown, Dialog)
- **Lucide Icons**
- **js-cookie** (auth token)
- **Dynamic Routing & Server Components**

## 🔐 Authentication

The app uses a token stored in cookies (`token`) set during login. Certain admin and preview pages require a valid token for access.

## 🧩 Features

### Public Pages

- Article listing with pagination
- Category filtering & search with debounce
- Hero section showing user info
- Article preview by slug

### Admin Pages

- Login (token-based auth via cookies)
- Article management:
  - Create, edit, delete
  - Upload thumbnail
  - Live preview
- Category management
- Profile and logout functionality

### UI/UX Enhancements

- Logout confirmation modal
- Dropdown menu in the header
- Form validation with feedback
- Loading states for better UX

## 🛠️ Installation & Development

### 1. Clone the Repository

```bash
git clone https://github.com/wikukarno/blog-genzet-frontend.git
cd blog-genzet-frontend
```
### 2. Install Dependencies

```bash
npm install
```
### 4. Access the App
Open your browser and go to http://localhost:3000.

### 🧾 Backend Repository
The backend repository is available here:
[Blog Genzet Backend](https://github.com/wikukarno/blog-genzet-backend)