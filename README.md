# JCI Conference Management App

A web application for managing delegates, trainings, and banquet seating for JCI Nigeria conferences.

## Features

- **Authentication**

  - Login system for admins
  - Role-based access control (SUPER_ADMIN, ADMIN)

- **Delegate Management**

  - Add, edit, and view delegates
  - Bulk import of delegate data
  - Assign trainings to delegates
  - Assign banquet seating to delegates
  - Generate QR codes for delegates

- **Training Management**

  - Add, edit, and view trainings
  - Assign trainers, locations, and times
  - Track delegate attendance

- **Banquet Seating**

  - Manage table assignments
  - Ensure local organizations sit together
  - Track table occupancy

- **QR Code System**
  - Generate QR codes for delegates
  - Scan QR codes to view delegate information
  - Download QR codes for printing

## Tech Stack

- **Frontend**
  - React 18
  - TypeScript
  - Vite
  - Tailwind CSS
  - shadcn/ui components
  - React Query for data fetching
  - Zustand for state management
  - React Router for routing
  - React Hook Form for form handling
  - Zod for validation
  - html5-qrcode for QR code scanning
  - qrcode.react for QR code generation

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file with the following variables:
   ```
   VITE_API_URL=http://localhost:3000
   VITE_APP_NAME=JCI Conference Management
   VITE_QR_SECRET_KEY=your-secret-key-here
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## Project Structure

```
src/
  ├── components/          # Reusable components
  │   ├── delegates/      # Delegate-related components
  │   ├── trainings/      # Training-related components
  │   ├── banquet/        # Banquet-related components
  │   ├── qr/            # QR code-related components
  │   ├── layout/        # Layout components
  │   └── ui/            # UI components
  ├── pages/              # Page components
  │   ├── auth/          # Authentication pages
  │   ├── delegates/     # Delegate management pages
  │   ├── trainings/     # Training management pages
  │   └── qr/            # QR code scanning pages
  ├── store/              # State management
  ├── types/              # TypeScript type definitions
  └── utils/              # Utility functions
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.
