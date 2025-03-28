# Arbitration Platform

A modern platform for managing arbitration cases, documents, and user roles.

## Features

- User authentication and role management
- Case creation and management
- Document upload and management
- Admin dashboard for user and case oversight
- Role-based access control (Admin, Arbitrator, Client)

## Technology Stack

- Next.js for frontend and API routes
- Supabase for database and authentication
- TypeScript for type safety
- Tailwind CSS for styling

## Development

### Prerequisites

- Node.js (v16+)
- npm or yarn
- Git

### Setup

1. Clone the repository
```bash
git clone https://github.com/KartikeShukla/arb_test.git
cd arb_test
```

2. Install dependencies
```bash
npm install
# or
yarn
```

3. Set up environment variables
Create a `.env.local` file with the following variables:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

4. Run the development server
```bash
npm run dev
# or
yarn dev
```

## License

[MIT](LICENSE)
