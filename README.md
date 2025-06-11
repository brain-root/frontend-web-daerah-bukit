<div align="right">

![Visitors](https://visitor-badge.laobi.icu/badge?page_id=Ryan-infitech.Simple-Website-Daerah)

</div>

<div align="center">

# Simple Regional Website - Bukittinggi

![desk-preview](./public/desk-preview.png)
![mobile-preview](./public/mobile-preview.png)

![React](https://img.shields.io/badge/React-18-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6)
![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3-38B2AC)
![Vite](https://img.shields.io/badge/Vite-4-646CFF)
![Node.js](https://img.shields.io/badge/Node.js-18-339933)
![Express](https://img.shields.io/badge/Express-4-000000)
![MySQL](https://img.shields.io/badge/MySQL-8-4479A1)

<p>A comprehensive web portal for Bukittinggi region showcasing tourism destinations, local businesses, events and community forums.</p>

</div>

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [API Documentation](#-api-documentation)
- [Contributing](#-contributing)

## 🌐 Overview

This project is a modern web portal for the Bukittinggi region in West Sumatra, Indonesia. The platform aims to promote tourism, support local businesses, and facilitate community engagement. It features a responsive design with both user-facing frontend and an administrative dashboard for content management.

## ✨ Features

### Public Features

- **Tourism Destinations**: Browse and discover tourist attractions with detailed information and image galleries
- **UMKM Directory**: Explore local businesses, products and services
- **Events Calendar**: Stay updated with upcoming events and activities in the region
- **Community Forum**: Engage in discussions categorized by topics
- **User Authentication**: Create accounts, login and participate in the community

### Admin Features

- **Dashboard**: Overview of site statistics and activity
- **Content Management**: Add, edit, and delete tourism destinations, businesses and events
- **User Management**: Manage user accounts and permissions
- **Forum Moderation**: Monitor and moderate community discussions

## 🛠 Tech Stack

### Frontend

- **React 18** with TypeScript
- **Vite** for build tooling
- **React Router** for navigation
- **TanStack Query** (React Query) for data fetching
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **Zod** for form validation
- **React Hook Form** for form management

### Backend

- **Node.js** with Express
- **TypeScript** for type safety
- **MySQL** database
- **JWT** for authentication
- **Bcrypt** for password hashing
- **Multer** for file uploads
- **Zod** for validation

## 📁 Project Structure

### Frontend Structure

```
src
├── assets                # Static assets like images and fonts
├── components            # Reusable React components
├── hooks                 # Custom React hooks
├── layouts                # Layout components for pages
├── pages                 # Page components for routing
├── services              # API service calls
├── styles                # Global styles and Tailwind CSS configuration
├── utils                 # Utility functions and constants
└── App.tsx               # Main app component
```

### Backend Structure

```
src
├── config                # Configuration files
├── controllers           # Route controllers for business logic
├── middleware            # Express middleware
├── models                # Database models and schemas
├── routes                # API route definitions
├── services              # Business logic and service layer
├── utils                 # Utility functions
├── app.ts                # Express app setup
└── server.ts             # Entry point for the server
```

## 🚀 Getting Started

To get a local copy up and running, follow these steps:

1. Clone the repo
   ```sh
   git clone https://github.com/Ryan-infitech/PPSJ_APP.git
   ```
2. Install frontend dependencies
   ```sh
   cd PPSJ_APP/frontend
   npm install
   ```
3. Install backend dependencies
   ```sh
   cd PPSJ_APP/backend
   npm install
   ```
4. Set up environment variables
   - Rename `.env.example` to `.env` in both `frontend` and `backend` folders
   - Update the variables with your configuration
5. Run the development servers

   ```sh
   # In the frontend folder
   npm run dev

   # In the backend folder
   npm run dev
   ```

6. Access the app
   - Frontend: `http://localhost:3000`
   - Backend: `http://localhost:5000`

## 📚 API Documentation

API documentation is available at [API Docs](https://react.dev/learn)

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests.

---

<div align="center">

**Ryan-infitech &nbsp;•&nbsp; [GitHub](https://github.com/Ryan-infitech) &nbsp;•&nbsp; [LinkedIn](https://www.linkedin.com/in/rian-septiawan/)**

</div>
