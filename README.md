# Amazon Clone - Full Stack E-commerce Application

This is a high-fidelity Amazon clone built with React.js, Django, and SQLite (PostgreSQL compatible). It features product browsing, search, category filtering, cart management, and a complete checkout flow.

## Tech Stack
- **Frontend**: React.js (Vite), Tailwind CSS, Lucide-React, Framer Motion, Context API.
- **Backend**: Python, Django, Django Rest Framework, Django-CORS-Headers.
- **Database**: SQLite (default for development), PostgreSQL (configured).

## Features
- **Product Listing**: Grid layout with Amazon-style cards, search, and category filtering.
- **Product Detail**: High-fidelity layout with image display, quantity selection, and detailed specs.
- **Shopping Cart**: Real-time quantity updates, item removal, and subtotal calculation.
- **Checkout**: Shipping address form and order summary review.
- **Order Placement**: Integration with backend to store orders and update stock.
- **Order Confirmation**: Clean success page with Order ID and summary.

## Setup Instructions

### Backend Setup
1. Navigate to the `backend` directory.
2. Create a virtual environment: `python -m venv venv`.
3. Activate the virtual environment: `.\venv\Scripts\activate` (Windows) or `source venv/bin/activate` (Mac/Linux).
4. Install dependencies: `pip install django djangorestframework django-cors-headers`.
5. Run migrations: `python manage.py migrate`.
6. Seed the database with sample data: `python seed.py`.
7. Start the server: `python manage.py runserver`.

### Frontend Setup
1. Navigate to the `frontend` directory.
2. Install dependencies: `npm install`.
3. Start the development server: `npm run dev`.

## Assumptions & Design Decisions
- **Authentication**: As per requirements, no login is required. A default user (Praveen) is assumed to be logged in for orders.
- **Database**: SQLite is used for ease of setup in the current environment, but the `settings.py` includes a commented-out PostgreSQL configuration.
- **UI Architecture**: Used React Context API for global state (Cart) to ensure smooth interactions without heavy external libraries like Redux.
