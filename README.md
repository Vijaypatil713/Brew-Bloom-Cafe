# ☕ Brew & Bloom – Cafe Website

A modern, responsive cafe website designed to provide customers with an attractive browsing experience and an online table reservation system.

## 📌 Project Overview

Brew & Bloom is a responsive cafe website featuring an interactive food and beverage menu, image gallery, online reservation form, and an admin dashboard for managing customer reservations.

The project uses Supabase as its online database and authentication service.

## ✨ Features

- Responsive homepage and navigation
- About section
- Interactive menu with category filters
- Coffee, food, and dessert items
- Cafe image gallery
- Online table reservation form with validation
- Store reservation details in Supabase
- Admin login with Supabase Authentication
- Admin dashboard to view customer reservations
- Delete reservation functionality
- Password recovery functionality
- Row Level Security (RLS) for database access
- Mobile-friendly design

## 🛠️ Technologies Used

- HTML5
- CSS3
- JavaScript
- Supabase (Database and Authentication)
- Google Fonts
- Unsplash Images
- Visual Studio Code
- Live Server

## 📂 Project Structure

```text
Brew-Bloom-Cafe/
│
├── index.html
├── admin.html
├── reset-password.html
├── README.md
│
├── css/
│   └── style.css
│
└── js/
    ├── script.js
    ├── admin.js
    └── supabase-config.js
```

## 🚀 How to Run the Project

1. Download or clone the project.
2. Open the project folder in Visual Studio Code.
3. Install the Live Server extension.
4. Configure your Supabase project credentials in `js/supabase-config.js`.
5. Open `index.html` using Live Server.
6. To access the Admin Dashboard, open `admin.html` using the same local server.

## 🗄️ Database and Authentication

This project uses Supabase for online reservation storage and administrator authentication.

The `reservations` table stores:

- Customer name
- Email address
- Phone number
- Reservation date
- Reservation time
- Additional message
- Booking creation timestamp

Supabase Authentication manages administrator login and password recovery.

Row Level Security (RLS) policies restrict reservation access to authorized administrators while allowing customers to submit reservations.

## 📋 Reservation Management

- Customers can submit table reservation requests.
- Reservation details are saved in the Supabase database.
- Administrators can securely log in.
- Administrators can view customer reservations.
- Administrators can delete individual reservations.

## 🔐 Security Note

The project uses a Supabase publishable key in the frontend. Database access is controlled through Row Level Security policies.

Never expose your Supabase secret or service role key in frontend code or GitHub.

## 👨‍💻 Developer

**Vijayagouda B. Patil**

Computer Science and Business Systems

S. G. Balekundri Institute of Technology, Belagavi
