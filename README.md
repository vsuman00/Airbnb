# 🏠 Airbnb Clone

![Airbnb Clone Banner](assect\Home.png)

A full-stack Airbnb clone with data scraping capabilities, robust REST API backend, and a modern React frontend.

## ✨ Features

- **🔍 Search & Filter**: Find listings by location, date, price, and amenities
- **📊 Detailed Listings**: View comprehensive property information with photo galleries
- **📱 Responsive Design**: Optimized for all device sizes
- **🔒 User Authentication**: Account creation, login, and profile management
- **🤖 Data Scraper**: Automated Airbnb data scraping functionality
- **🔄 RESTful API**: Well-documented backend endpoints

![Screenshot of Search Page](assect\Search.png)

## 🛠️ Tech Stack

### Frontend

- Next.js 15 (React 19)
- Material UI & Emotion
- Tailwind CSS
- TypeScript
- React Date Range for calendar functionality
- Axios for API requests

### Backend

- Django 5.2
- Django REST Framework
- SQLite (development) / MySQL (production)
- JWT Authentication

### Data Scraping

- Scrapy
- Beautiful Soup
- Python

## 🚀 Getting Started

### Prerequisites

- Python 3.8+
- Node.js 14+
- npm or yarn
- Git

### Installation

#### Clone the repository

```bash
git clone https://github.com/vsuman00/Airbnb.git
cd Airbnb
```

#### Backend Setup

```bash
cd backend

# Create and activate virtual environment (optional but recommended)
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Setup environment variables
cp env.example .env
# Edit .env with your configuration

# Run migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Start server
python manage.py runserver
```

#### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

#### Scraper Setup

```bash
cd scraper

# Install dependencies
pip install -r requirements.txt

# Run scraper
python run_spider.py --location "New York" --checkin "2025-05-01" --checkout "2025-05-05" --guests "2"
```

## 📸 Screenshots

### Home Page

![Home Page](/assect/Home.png)

### Listing Details

![Listing Details](/assect/Listing.png)

### Search Results

![Search Results](https://user-images.githubusercontent.com/12345678/airbnb-search.png)

## 📝 API Documentation

### Endpoints

| Method | Endpoint              | Description                                   |
| ------ | --------------------- | --------------------------------------------- |
| GET    | `/api/listings/`      | Retrieve all listings with optional filtering |
| GET    | `/api/listings/{id}/` | Retrieve specific listing details             |
| POST   | `/api/add_listing/`   | Add a new listing                             |
| GET    | `/api/users/me/`      | Get current user profile                      |
| POST   | `/api/auth/login/`    | User login                                    |
| POST   | `/api/auth/register/` | User registration                             |

## 🔧 Configuration

### Environment Variables

Backend:

- `SECRET_KEY`: Django secret key
- `DEBUG`: Set to True for development
- `DATABASE_URL`: Database connection string

Frontend:

- `NEXT_PUBLIC_API_URL`: Backend API URL

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👏 Acknowledgements

- [Next.js](https://nextjs.org/)
- [Django](https://www.djangoproject.com/)
- [Material UI](https://mui.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Airbnb](https://www.airbnb.com/) for design inspiration
