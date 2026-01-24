# Medicine Reminder System - Frontend

A modern, responsive React application for managing medication schedules with a premium UI/UX design.

## Features

- 🔐 **Authentication**: Secure login and registration with JWT
- 💊 **Medicine Management**: Add, view, and delete medicines with custom schedules
- ⏰ **Dose Tracking**: Track doses with Take, Miss, and Snooze actions
- 👥 **Caregiver Support**: Monitor multiple patients' medication adherence
- 📊 **Reports & Analytics**: Visual charts and statistics for adherence tracking
- 🌓 **Dark Mode**: Toggle between light and dark themes
- 📱 **Responsive Design**: Works seamlessly on mobile, tablet, and desktop

## Tech Stack

- **React 18** - UI library
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Recharts** - Data visualization
- **React Icons** - Icon library

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file (already created):
```env
VITE_API_BASE_URL=http://localhost:8080/api
```

4. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### Building for Production

```bash
npm run build
```

The production build will be in the `dist` folder.

## Project Structure

```
frontend/
├── src/
│   ├── components/       # Reusable UI components
│   │   ├── Button.jsx
│   │   ├── DoseCard.jsx
│   │   ├── LoadingSpinner.jsx
│   │   ├── MedicineCard.jsx
│   │   ├── Modal.jsx
│   │   ├── Navbar.jsx
│   │   ├── ProtectedRoute.jsx
│   │   └── Toast.jsx
│   ├── context/          # React context providers
│   │   ├── AuthContext.jsx
│   │   └── ThemeContext.jsx
│   ├── pages/            # Page components
│   │   ├── AddMedicine.jsx
│   │   ├── CaregiverDashboard.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Login.jsx
│   │   ├── Medicines.jsx
│   │   ├── Register.jsx
│   │   └── Reports.jsx
│   ├── services/         # API service layer
│   │   ├── api.js
│   │   ├── authService.js
│   │   ├── caregiverService.js
│   │   ├── doseService.js
│   │   ├── medicineService.js
│   │   └── reportService.js
│   ├── App.jsx           # Main app component
│   ├── main.jsx          # Entry point
│   └── index.css         # Global styles
├── index.html
├── package.json
└── vite.config.js
```

## Design System

The application features a premium design system with:

- **Vibrant gradients** for buttons and accents
- **Glassmorphism effects** on cards
- **Smooth animations** and micro-interactions
- **Responsive grid layouts**
- **Custom color palette** with dark mode support
- **Modern typography** using Inter font

## API Integration

The frontend connects to the Spring Boot backend at `http://localhost:8080/api`. Make sure the backend is running before starting the frontend.

### Available Endpoints

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/medicine/myMedicines` - Get user's medicines
- `POST /api/medicine/add` - Add new medicine
- `DELETE /api/medicine/delete/{id}` - Delete medicine
- `POST /api/dose/taken/{id}` - Mark dose as taken
- `POST /api/dose/missed/{id}` - Mark dose as missed
- `POST /api/dose/snooze/{id}` - Snooze dose
- `GET /api/report/today` - Get today's report
- `POST /api/caregiver/add` - Add patient
- `GET /api/caregiver/patients` - Get patients

## User Roles

- **PATIENT**: Manage own medications
- **CAREGIVER**: Monitor multiple patients' medications

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT
