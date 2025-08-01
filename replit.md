# T-Rex Motors - Used Car Dealership Website

## Overview
T-Rex Motors is a full-stack web application for a used car dealership. It provides a modern, responsive interface for browsing vehicle inventory, viewing detailed vehicle information, and submitting inquiries. The project aims to offer a clean, automotive-focused design, enhance customer interaction, and streamline inventory management. Its business vision is to provide a robust online presence for car dealerships, offering a competitive edge in the market.

## Recent Changes (August 2025)
- Fixed critical database configuration error (Drizzle ORM setup)
- Resolved "OK" response issue by replacing health check route with proper index.html serving
- Installed missing Tailwind CSS dependencies (@tailwindcss/typography, @tailwindcss/forms, @tailwindcss/aspect-ratio)
- Updated Vercel deployment configuration to use pre-built static files
- Successfully deployed to Vercel with working vehicle inventory API and frontend

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture

### UI/UX Decisions
The application features a modern, clean, automotive-focused aesthetic with a custom color scheme and responsive design. It utilizes shadcn/ui and Radix UI for consistent, accessible components and ARIA compliance. Design emphasizes performance through optimized images, lazy loading, and efficient state management. SEO is integrated with meta tags and semantic HTML.

### Technical Implementations
**Frontend:** Built with React (TypeScript) and Vite for fast development and production builds. Wouter handles client-side routing, and TanStack React Query manages server state. Tailwind CSS is used for styling.
**Backend:** Developed with Node.js and Express.js (TypeScript) for RESTful API endpoints. It currently uses in-memory storage, designed for future integration with PostgreSQL via Drizzle ORM.
**Data Flow:** Frontend requests data using TanStack Query. Express handles API requests and validation, interacting with the storage layer. Data flows back to React components, with React Query managing cache and re-renders.

### Feature Specifications
**Vehicle Management:** Includes a responsive grid display for vehicles with image galleries, multi-criteria search and filter options, comprehensive single-vehicle views with image carousels, and inventory status tracking (for-sale, sold, pending).
**Customer Interaction:** Features contact forms for inquiries (with vehicle-specific context), toast notifications for user feedback, and a mobile-first responsive design.
**System Design Choices:** The application is architected for scalability, with a clear separation of concerns between frontend and backend. The storage interface allows for easy swapping of database technologies. Development benefits from hot module replacement and continuous type checking. Production builds are optimized for performance and bundled using Vite and ESBuild. It supports PWA functionality, comprehensive SEO (structured data, JSON-LD, Open Graph), and integrations for vehicle history reports.

## External Dependencies

### Core Framework Dependencies
- **React Ecosystem:** React 18, React DOM, TanStack React Query
- **TypeScript:** For full type safety
- **Build Tools:** Vite, ESBuild

### UI Library Dependencies
- **Radix UI:** Accessible component primitives
- **Tailwind CSS:** Utility-first CSS framework
- **Lucide Icons:** Modern icon library

### Backend Dependencies
- **Express.js:** Node.js web framework
- **Drizzle ORM:** Type-safe database ORM (PostgreSQL support)
- **Zod:** Schema validation library

### Integrations
- **PostgreSQL:** Planned database integration, managed with Drizzle Migrations.
- **Neon Database:** Serverless PostgreSQL integration.
- **CARFAX, AutoCheck:** Third-party vehicle history report providers.
- **Google Apps Script:** For webhook integration with Google Sheets.
- **Nodemailer:** For email notifications.