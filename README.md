# Arbitration Platform

A modern web application for managing arbitration cases, built with Next.js, TypeScript, and Supabase.

## Features

- **User Authentication**: Sign up, sign in, and OAuth support (Google)
- **Role-Based Authorization**: Different dashboards and capabilities for admins and regular users
- **Case Management**:
  - Users can submit new arbitration cases with supporting documents
  - Admins can view, manage, and update the status of all cases
  - Users can track the status of their own cases
- **User Management**: Admins can approve new users and assign roles
- **Document Uploads**: Upload documents to support arbitration cases

## Getting Started

### Prerequisites

- Node.js 16+ and npm/yarn
- Supabase account for database and authentication

### Environment Setup

1. Clone the repository:
   ```
   git clone <repository-url>
   cd arbitration-platform
   ```

2. Install dependencies:
   ```
   npm install
   # or
   yarn install
   ```

3. Create a `.env.local` file in the root directory with your Supabase credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

4. Start the development server:
   ```
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
arbitration-platform/
├── public/          # Static assets
├── src/             # Source code
│   ├── app/         # Next.js app router
│   ├── components/  # React components
│   │   ├── auth/    # Authentication components
│   │   ├── case-form/ # Case submission form
│   │   ├── dashboard/ # Dashboard components
│   │   └── ui/      # UI components
│   ├── config/      # Configuration files
│   ├── hooks/       # Custom React hooks
│   ├── types/       # TypeScript types
│   └── utils/       # Utility functions
├── .env.local       # Environment variables (create this file)
├── next.config.js   # Next.js configuration
└── package.json     # Project dependencies
```

## Database Schema

The application uses a Supabase PostgreSQL database with the following tables:

- `users`: Managed by Supabase Auth
- `profiles`: Extended user information
- `user_roles`: User roles and approval status
- `cases`: Arbitration case information
- `documents`: References to case documents

## Code Quality and Best Practices

This project follows these best practices:

1. **Type Safety**: Strong TypeScript typing throughout the application
2. **Component Structure**: Separation of concerns with modular, reusable components
3. **Error Handling**: Comprehensive error handling with user-friendly messages
4. **Accessibility**: ARIA attributes, keyboard navigation, and screen reader support
5. **Performance Optimization**: Memoization, callback optimizations, and efficient rendering
6. **Security**: Proper authentication and authorization checks

## Deployment

The application can be deployed to Vercel:

1. Push your code to a GitHub repository
2. Connect your repository to Vercel
3. Set up the environment variables in the Vercel dashboard
4. Deploy

## Role-Based Access

The platform implements the following roles:

- **Admin**: Can view and manage all cases and users
- **User**: Can create and view their own cases
- **Arbitrator**: Can view all cases and update case statuses (optional role)

## Contributing

1. Create a feature branch (`git checkout -b feature/amazing-feature`)
2. Commit your changes (`git commit -m 'Add some amazing feature'`)
3. Push to the branch (`git push origin feature/amazing-feature`)
4. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
