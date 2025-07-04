# Database Setup Guide

## Environment Variables

Add the following environment variables to your `.env.dev` or `.env.prod` file:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=password
DB_NAME=writewell

# Node Environment
NODE_ENV=development

# DataForSEO Configuration
DATAFORSEO_USERNAME=your_username
DATAFORSEO_PASSWORD=your_password

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key

# Server Configuration
PORT=3000
```

## PostgreSQL Setup

1. Install PostgreSQL on your system
2. Create a database named `writewell`:

   ```sql
   CREATE DATABASE writewell;
   ```

3. Update your environment variables with the correct database credentials

## Database Schema

The application will automatically create the following tables when started:

- `users` - User accounts
- `accounts` - Company/organization accounts
- `account_users` - Junction table for user-account relationships
- `content_calendars` - Content calendars for each account
- `content_items` - Individual content items (blog posts, social media posts)

## Entity Relationships

- **Users ↔ Accounts**: Many-to-many relationship
- **Account → Content Calendar**: One-to-one relationship
- **Content Calendar → Content Items**: One-to-many relationship

## API Endpoints

### Users

- `POST /api/users` - Create user
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `GET /api/users/email/:email` - Get user by email
- `PATCH /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user
- `POST /api/users/:userId/accounts/:accountId` - Add account to user
- `DELETE /api/users/:userId/accounts/:accountId` - Remove account from user

### Accounts

- `POST /api/accounts` - Create account
- `GET /api/accounts` - Get all accounts
- `GET /api/accounts/:id` - Get account by ID
- `GET /api/accounts/user/:userId` - Get accounts by user
- `PATCH /api/accounts/:id` - Update account
- `DELETE /api/accounts/:id` - Delete account
- `POST /api/accounts/:id/keywords` - Add keywords to account
- `DELETE /api/accounts/:id/keywords` - Remove keywords from account

### Content Calendars

- `POST /api/content-calendars` - Create content calendar
- `GET /api/content-calendars` - Get all content calendars
- `GET /api/content-calendars/:id` - Get content calendar by ID
- `GET /api/content-calendars/account/:accountId` - Get content calendar by account
- `GET /api/content-calendars/user/:userId` - Get content calendars by user
- `PATCH /api/content-calendars/:id` - Update content calendar
- `DELETE /api/content-calendars/:id` - Delete content calendar

### Content Items

- `POST /api/content-items` - Create content item
- `GET /api/content-items` - Get all content items (with filters)
- `GET /api/content-items/:id` - Get content item by ID
- `GET /api/content-items/calendar/:calendarId` - Get content items by calendar
- `GET /api/content-items/account/:accountId` - Get content items by account
- `GET /api/content-items/user/:userId` - Get content items by user
- `GET /api/content-items/date-range` - Get content items by date range
- `PATCH /api/content-items/:id` - Update content item
- `DELETE /api/content-items/:id` - Delete content item
- `POST /api/content-items/:id/publish` - Publish content item
- `POST /api/content-items/:id/unpublish` - Unpublish content item

## Getting Started

1. Install dependencies:

   ```bash
   yarn install
   ```

2. Set up your environment variables in `.env.dev`

3. Start the development server:

   ```bash
   yarn start:dev
   ```

4. Visit `http://localhost:3000/api` to see the Swagger documentation

The database tables will be automatically created when the application starts in development mode.
