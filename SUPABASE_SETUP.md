# Supabase Setup Guide for Morobo Website

This guide will help you set up Supabase authentication and database for the Morobo website client dashboard.

## Step 1: Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in to your account
3. Click "New Project"
4. Fill in the project details:
   - **Name**: Morobo Website
   - **Database Password**: (create a strong password and save it)
   - **Region**: Choose the closest region to your users
5. Click "Create new project"

## Step 2: Get Your Supabase Credentials

1. Once your project is created, go to **Settings** > **API**
2. Copy the following values:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon public** key

3. Open `auth.js` in your website folder
4. Replace the placeholder values:
   ```javascript
   const SUPABASE_URL = 'YOUR_SUPABASE_URL'; // Replace with your Project URL
   const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY'; // Replace with your anon public key
   ```

## Step 3: Set Up Database Tables

Run these SQL commands in the Supabase SQL Editor (**SQL Editor** in the left sidebar):

### Create Projects Table
```sql
create table projects (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  name text not null,
  description text,
  status text default 'pending',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table projects enable row level security;

-- Create policy to allow users to see only their own projects
create policy "Users can view their own projects"
  on projects for select
  using (auth.uid() = user_id);

create policy "Users can insert their own projects"
  on projects for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own projects"
  on projects for update
  using (auth.uid() = user_id);
```

### Create Invoices Table
```sql
create table invoices (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  invoice_number text not null,
  amount decimal(10, 2) not null,
  status text default 'pending',
  description text,
  due_date date,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table invoices enable row level security;

-- Create policies
create policy "Users can view their own invoices"
  on invoices for select
  using (auth.uid() = user_id);
```

### Create Support Tickets Table
```sql
create table support_tickets (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  subject text not null,
  message text not null,
  status text default 'open',
  priority text default 'normal',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table support_tickets enable row level security;

-- Create policies
create policy "Users can view their own tickets"
  on support_tickets for select
  using (auth.uid() = user_id);

create policy "Users can create tickets"
  on support_tickets for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own tickets"
  on support_tickets for update
  using (auth.uid() = user_id);
```

## Step 4: Configure Email Authentication

1. Go to **Authentication** > **Providers** in Supabase
2. Make sure **Email** is enabled
3. Configure email templates (optional):
   - Go to **Authentication** > **Email Templates**
   - Customize the confirmation and password reset emails

## Step 5: Test the Setup

1. Open your website locally or deploy it
2. Go to the login page (`auth.html`)
3. Create a new account
4. Check your email for the confirmation link
5. Confirm your email and log in
6. You should be redirected to the dashboard

## Step 6: Add Admin Access (Optional)

To manually create admin users or view user data:

1. Go to **Authentication** > **Users** in Supabase
2. Click **Add user** to manually create accounts
3. View all registered users and their metadata

## Database Schema Overview

- **projects**: Stores client projects
  - `user_id`: Links to the authenticated user
  - `name`: Project name
  - `status`: pending, active, completed, cancelled
  
- **invoices**: Stores client invoices
  - `invoice_number`: Unique invoice identifier
  - `amount`: Invoice amount
  - `status`: pending, paid, overdue
  
- **support_tickets**: Stores support requests
  - `subject`: Ticket subject
  - `message`: Ticket message
  - `status`: open, in_progress, resolved, closed

## Security Notes

- ⚠️ **Never commit your Supabase credentials to GitHub**
- Add `auth.js` to `.gitignore` if you're using version control
- Use environment variables for production deployments
- Row Level Security (RLS) is enabled to ensure users can only see their own data

## Next Steps

1. Customize the dashboard to show real data from Supabase
2. Add forms to create new projects, tickets, etc.
3. Implement invoice payment integration (Stripe)
4. Add email notifications for new invoices/tickets
5. Create an admin panel for Morobo team members

## Support

For issues with Supabase, check:
- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Discord](https://discord.supabase.com)
