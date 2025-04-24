# Training Management System - Client

This is the frontend application for the Training Management System, built with React, TypeScript, and Vite.

## Features

- Modern, responsive UI with Tailwind CSS
- User authentication and authorization
- Delegate management with CRUD operations
- Training session management
- Attendance tracking
- Banquet seating management
- QR code generation and scanning
- Real-time updates

## Tech Stack

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Shadcn UI Components
- React Query for data fetching
- Axios for API communication
- React Router for navigation
- Zustand for state management

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
VITE_API_URL=http://localhost:3000/api
```

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up your environment variables
4. Start the development server:
   ```bash
   npm run dev
   ```

## Development

To run the application in development mode with hot reloading:

```bash
npm run dev
```

## Building for Production

To create a production build:

```bash
npm run build
```

To preview the production build:

```bash
npm run preview
```

## Project Structure

```
src/
├── assets/         # Static assets
├── components/     # Reusable components
│   ├── admin/     # Admin-specific components
│   ├── banquet/   # Banquet-related components
│   ├── delegates/ # Delegate-related components
│   ├── forms/     # Form components
│   ├── layout/    # Layout components
│   ├── qr/        # QR code components
│   ├── trainings/ # Training-related components
│   └── ui/        # UI components
├── hooks/         # Custom React hooks
├── lib/           # Utility functions and API clients
├── pages/         # Page components
├── store/         # State management
├── types/         # TypeScript type definitions
└── App.tsx        # Root component
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## Component Library

The application uses Shadcn UI components, which are built on top of Radix UI and styled with Tailwind CSS. Key components include:

- Buttons
- Cards
- Dialogs
- Dropdowns
- Forms
- Tables
- Pagination

## State Management

The application uses Zustand for state management, with the following stores:

- `auth.ts` - Authentication state
- Additional stores for other features

## API Integration

The application communicates with the backend API using Axios. API clients are organized in the `src/lib/api` directory:

- `auth.ts` - Authentication endpoints
- `delegates.ts` - Delegate management
- `trainings.ts` - Training management
- `qr.ts` - QR code operations

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the ISC License.
