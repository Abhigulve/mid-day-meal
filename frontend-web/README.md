# Mid-Day Meal Web Frontend

React web application for the Mid-Day Meal Management System.

## Prerequisites

- Node.js 16+ 
- npm or yarn

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Configuration

Create a `.env` file in the root directory:

```env
REACT_APP_API_URL=http://localhost:8080/api
REACT_APP_APP_NAME=Mid-Day Meal Management
```

### 3. Run Development Server

```bash
npm start
```

The application will open at `http://localhost:3000`

### 4. Build for Production

```bash
npm run build
```

## Features

- **Dashboard**: Overview of meal statistics and quick actions
- **Schools Management**: Add, edit, and manage school information
- **Menu Planning**: Create and manage monthly meal menus
- **Meal Records**: Track daily meal serving records
- **Reports**: Generate various reports and analytics
- **Responsive Design**: Works on desktop, tablet, and mobile

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `npm run eject` - Ejects from Create React App (one-way operation)

## Technologies Used

- **React 18** - Frontend framework
- **Material-UI** - UI component library
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Recharts** - Charts and data visualization
- **TypeScript** - Type safety

## Default Login Credentials

- **Admin**: username: `admin`, password: `admin123`
- **Principal**: username: `principal_gps001`, password: `principal123`
- **Teacher**: username: `teacher_gps001`, password: `teacher123`

## Project Structure

```
src/
├── components/     # Reusable UI components
├── pages/         # Main application pages
├── services/      # API services and utilities
├── types/         # TypeScript type definitions
└── utils/         # Helper functions and constants
```